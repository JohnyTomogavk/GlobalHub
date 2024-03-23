# :globe_with_meridians: Global Hub

> The app is a personal organizer for managing your projects, tasks, budgets and notes.

## There are 3 types of functionality:
1. :dollar: Budgets
   * Storing expenses and incomings
   * Managing projects
   * Displaying current budget's balance
   * Calculation analytic on expenses by several parameters
2. :blue_book: Notes
   * Light and Easy text editor (_WYSIWYG_)
   * Different types of blocks that you are able to use
3. *white_check_mark: Projects
   * Creating tasks and events
   * Grouping by projects
   * Table, ~~Timeline~~ and ~~Kanban~~ views for tasks displaying
   * Status transitions on tasks
   * Notifications on start and due dates
4. Full-Text search across all your stuff

## Architecture
> The design based on microservice architecture with asynchronous communications\
> There are 3 functional microservices responsible for managing main entities like Budgets, Projects and Notes:\
> 1. Notes Service
> 2. Budgets Service
> 3. Projects Service
> 
> Also there are microservices responsible for common functionality:
> 1. API Gateway
> 2. Identity Service
> 3. Notification Service
> 4. Full-Text Search Service

## Technical stack
1. **Backend:** .NET 7, ASP.NET Web API, Duende Identity Server, MediatR, Hangfire, Entity Framework Core, MassTransit_(over RabbitMQ_), OData, Ocelot, SignalR
2. **Databases and storages:** MS SQL Server, PostgreSQL, MongoDB, ElasticSearch
3. **Frontend:** React, Typescript, Ant Design, Mobx, Styled Components, Webpack
4. **CI/CD:** Teamcity(_Independent build + deployment_), Docker, Docker-compose

## Getting started
> [!Important]
> The makefile supposed to be used only for running App in demo mode.\
> For development purposes consider either running docker containers and configuring port forwardings manually
> or running service in IDE

### Running in demo mode using makefile
> [!Before start ensure you have installed:]
> 1. Docker
> 2. Makefile utility 
1. Clone the repository to your local folder
2. In `GlobalHub/` directory create `.env` file using `.env.template` template, default values should be enough for app start.
3. Run `make up` from  `GlobalHub/GlobalHub`
