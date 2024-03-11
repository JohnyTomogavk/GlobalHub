namespace FullTextSearchApi.Configs;

public static class MassTransitConfig
{
    public static IServiceCollection ConfigureMassTransit(this IServiceCollection serviceCollection)
    {
        serviceCollection.AddMassTransit(configurator =>
        {
            configurator.AddConsumer<SearchItemCreatedConsumer<ProjectSearchItem>>();
            configurator.AddConsumer<SearchItemCreatedConsumer<ProjectItemSearchItem>>();
            configurator.AddConsumer<SearchItemCreatedConsumer<BudgetSearchItem>>();
            configurator.AddConsumer<SearchItemCreatedConsumer<BudgetItemSearchItem>>();
            configurator.AddConsumer<SearchItemCreatedConsumer<NoteSearchItem>>();

            configurator.AddConsumer<UpdateNoteSearchItemConsumer>();
            configurator.AddConsumer<UpdateProjectSearchItemConsumer>();
            configurator.AddConsumer<UpdateProjectItemSearchItemConsumer>();
            configurator.AddConsumer<UpdateBudgetSearchItemConsumer>();
            configurator.AddConsumer<UpdateBudgetItemSearchItemConsumer>();

            configurator.UsingRabbitMq((context, cfg) =>
            {
                var eventBusConnectionString =
                    Environment.GetEnvironmentVariable(CommonConstants.EVENT_BUS_CONNECTION_STRING_KEY);
                ArgumentNullException.ThrowIfNull(eventBusConnectionString);

                cfg.Host(new Uri(eventBusConnectionString));
                cfg.ConfigureEndpoints(context);
            });
        });

        return serviceCollection;
    }
}
