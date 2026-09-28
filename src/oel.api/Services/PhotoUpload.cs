namespace Oel.Api.Services;

public sealed record PhotoData(byte[] Bytes, string ContentType);

public static class PhotoUpload
{
    private static readonly long _maxSize = 20 * 1024 * 1024; // 20 MB

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

        if (file.Length > _maxSize)
        {
            return (null, "Photo must be 20 MB or smaller.");
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
