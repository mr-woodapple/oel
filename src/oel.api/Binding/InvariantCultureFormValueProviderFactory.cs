using System.Globalization;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Oel.Api.Binding;

public sealed class InvariantCultureFormValueProviderFactory : IValueProviderFactory
{
    public async Task CreateValueProviderAsync(ValueProviderFactoryContext context)
    {
        ArgumentNullException.ThrowIfNull(context);

        var httpContext = context.ActionContext.HttpContext;
        var request = httpContext.Request;
        if (!request.HasFormContentType)
        {
            return;
        }

        var form = await request.ReadFormAsync(httpContext.RequestAborted);
        context.ValueProviders.Add(new FormValueProvider(
            BindingSource.Form,
            form,
            CultureInfo.InvariantCulture));
    }
}
