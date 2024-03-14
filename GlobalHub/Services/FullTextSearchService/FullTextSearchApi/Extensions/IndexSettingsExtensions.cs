namespace FullTextSearchApi.Extensions;

public static class IndexSettingsExtensions
{
    public static CreateIndexDescriptor ConfigureAutoKeywords(this CreateIndexDescriptor descriptor)
    {
        descriptor.Settings(s =>
        {
            s.Analysis(a =>
                a.Normalizers(n => n.Custom("lowercase", cn => cn.Filters("lowercase"))));

            descriptor.Map(m =>
                m.DynamicTemplates(dt =>
                    dt.DynamicTemplate("string_to_keyword", t =>
                        t.MatchMappingType("string")
                            .Mapping(map => map.Keyword(k => k.Normalizer("lowercase"))))));

            return s;
        });

        return descriptor;
    }
}
