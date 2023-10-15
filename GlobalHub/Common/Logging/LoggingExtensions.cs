using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Serilog;
using Serilog.Sinks.Elasticsearch;

namespace Common.Logging;

public static class SerilogExtensions
{
    public static Action<HostBuilderContext, LoggerConfiguration> LoggerConfiguration =>
        (context, configuration) =>
        {
            var logStorageUri = Environment.GetEnvironmentVariable("LOG_STORAGE");

            if (logStorageUri == null)
            {
                return;
            }

            configuration
                .Enrich.WithMachineName()
                .WriteTo.Console()
                .Enrich.FromLogContext()
                .WriteTo.Elasticsearch(
                    new ElasticsearchSinkOptions(new Uri(logStorageUri))
                    {
                        IndexFormat =
                            $"applogs-{context.HostingEnvironment.ApplicationName?.ToLower().Replace(".", "-")}-{context.HostingEnvironment.EnvironmentName?.ToLower().Replace(".", "-")}-{DateTime.UtcNow:yyyy-MM}",
                        TemplateName = "Common service logs template",
                        AutoRegisterTemplate = true,
                        NumberOfShards = 1,
                        NumberOfReplicas = 1,
                        OverwriteTemplate = true,
                        AutoRegisterTemplateVersion = AutoRegisterTemplateVersion.ESv7,
                        TypeName = null,
                        BatchAction = ElasticOpType.Create
                    })
                .Enrich.WithProperty("Environment", context.HostingEnvironment.EnvironmentName)
                .Enrich.WithProperty("Application", context.HostingEnvironment.ApplicationName)
                .Enrich.WithCorrelationId()
                .Enrich.WithCorrelationIdHeader()
                .ReadFrom.Configuration(context.Configuration);
        };
}
