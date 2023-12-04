namespace Common.Extensions;

public static class HostEnvironmentExtensions
{
    private const string DockerComposeEnvironmentName = "DOCKER_COMPOSE_DEMO";

    public static bool IsDockerComposeEnvironment(this IHostEnvironment environment)
    {
        return environment.IsEnvironment(DockerComposeEnvironmentName);
    }
}
