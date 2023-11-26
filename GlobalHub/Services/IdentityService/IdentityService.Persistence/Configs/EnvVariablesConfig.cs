namespace IdentityService.Persistence.Configs;

public static class EnvVariablesConfig
{
    public const string IdentityDbConnectionStringKey = "IDENTITY_DB_CONNECTION_STRING";
    public const string ConfigurationDbConnectionStringKey = "CONFIGURATION_DB_CONNECTION_STRING";
    public const string OperationalDbConnectionStringKey = "OPERATIONAL_DB_CONNECTION_STRING";
    public const string ReinitializeIdentityResources = "REINITIALIZE_IDENTITY_RESOURCES";
}
