namespace Oel.Api.Services;

public sealed record PhotoData(byte[] Bytes, string ContentType);

public static class PhotoUpload
{
    public const long MaxSize = 10 * 1024 * 1024;

    private static readonly HashSet<string> AllowedContentTypes = new(StringComparer.OrdinalIgnoreCase)
    {
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
        "image/avif",
        "image/heic",
        "image/heif",
    };

    public static async Task<(PhotoData? Photo, string? Error)> ReadAsync(
        IFormFile? file,
        CancellationToken cancellationToken)
    {
        if (file is null || file.Length == 0)
        {
            return (null, null);
        }

        if (file.Length > MaxSize)
        {
            return (null, "Photo must be 10 MB or smaller.");
        }

        if (!AllowedContentTypes.Contains(file.ContentType))
        {
            return (null, "Photo must be a JPEG, PNG, WebP, GIF, AVIF, HEIC, or HEIF image.");
        }

        await using var stream = new MemoryStream((int)file.Length);
        await file.CopyToAsync(stream, cancellationToken);

        return (new PhotoData(stream.ToArray(), file.ContentType.ToLowerInvariant()), null);
    }
}
