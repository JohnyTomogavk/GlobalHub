namespace ProjectService.Presentation.Config;

public static class ODataConfig
{
    public static void RegisterOData(this IMvcBuilder mvcBuilder)
    {
        mvcBuilder.AddOData(options =>
        {
            options.Select()
                .Filter()
                .Expand()
                .Count()
                .OrderBy()
                .SetMaxTop(1000)
                .AddRouteComponents(GetModel());
        });
    }

    private static IEdmModel GetModel()
    {
        var builder = new ODataConventionModelBuilder();
        builder.EnableLowerCamelCase();

        builder.EntitySet<Project>("Projects");
        builder.EntitySet<ProjectItem>("ProjectItems");
        builder.EntitySet<Tag>("Tags");

        return builder.GetEdmModel();
    }
}
