namespace Common.Extensions;

public static class ConfigurationBuilderExtensions
{
    public static IConfigurationBuilder AddEnvFilesToConfiguration(this IConfigurationBuilder builder)
    {
        return builder.AddDotNetEnv(".env", LoadOptions.TraversePath());
    }
}
