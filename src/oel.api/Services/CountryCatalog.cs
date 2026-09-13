namespace Oel.Api.Services;

public static class CountryCatalog
{
    // ISO 3166-1 alpha-2 country and territory codes. Keep selection and validation
    // on the same list; display names are localized by the frontend.
    // https://www.iso.org/obp/ui/#search/code/
    public static IReadOnlyList<string> Codes { get; } = Array.AsReadOnly(
        ("AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ " +
         "BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ " +
         "CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ " +
         "DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR " +
         "GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY " +
         "HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP " +
         "KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY " +
         "MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ " +
         "NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY " +
         "QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ " +
         "TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG UM US UY UZ " +
         "VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW").Split(' '));

    private static readonly HashSet<string> ValidCodes = new(Codes, StringComparer.Ordinal);

    public static string? Normalize(string? code) =>
        string.IsNullOrWhiteSpace(code) ? null : code.Trim().ToUpperInvariant();

    public static bool IsValid(string? code) =>
        Normalize(code) is not { } normalized || ValidCodes.Contains(normalized);
}
