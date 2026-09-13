using System.ComponentModel.DataAnnotations;
using Oel.Api.Services;

namespace Oel.Api.Contracts;

[AttributeUsage(AttributeTargets.Property)]
public sealed class CountryCodeAttribute : ValidationAttribute
{
    public CountryCodeAttribute() : base("Select a valid two-letter country code.") { }

    public override bool IsValid(object? value) =>
        value is null || value is string code && CountryCatalog.IsValid(code);
}
