# :globe_with_meridians: Global Hub

> The app is a personal organizer for managing your projects, tasks, budgets and notes.

## :point_right: There are 3 types of functionality:
1. :dollar: Budgets
   * Storing expenses and incomings
   * Managing projects
   * Displaying current budget's balance
   * Calculation analytic on expenses by several parameters
2. :blue_book: Notes
   * Light and Easy text editor (_WYSIWYG_)
   * Different types of blocks that you are able to use
3. :ballot_box_with_check: Projects
   * Creating tasks and events
   * Grouping by projects
   * Table, ~~Timeline~~ and ~~Kanban~~ views for tasks displaying
   * Status transitions on tasks
   * Notifications on start and due dates
4. :mag_right: Full-Text search across all your stuff

## :wrench: Architecture
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

## :man_technologist: Technical stack
1. **Backend:** .NET 7, ASP.NET Web API, Duende Identity Server, MediatR, Hangfire, Entity Framework Core, MassTransit(_over RabbitMQ_), OData, Ocelot, SignalR
2. **Databases and storages:** MS SQL Server, PostgreSQL, MongoDB, ElasticSearch
3. **Frontend:** React, Typescript, Ant Design, Mobx, Styled Components, Webpack
4. **CI/CD:** Teamcity(_Independent build + deployment_), Docker, Docker-compose

## :fast_forward: Getting started
> [!IMPORTANT]
> The makefile supposed to be used only for running App in demo mode.\
> For development purposes consider either running docker containers and configuring ports forwardings manually
> or running services in IDE

<details>
<summary>Running in demo mode using makefile</summary>

> **Before start ensure you have installed:**
> 1. Docker
> 2. GNU Make utility

1. Clone the repository to your local folder
2. In `GlobalHub/` directory create `.env` file using `.env.template` template, default values should be enough for app start.
3. Run `make up` from  `GlobalHub/GlobalHub` directory
</details>

## :bulb: Inspiration
1. Notion
2. Jira
3. Money Keeper

## :people_holding_hands: Contributing
In case You are interested in contributing to the project, I would really appreciate it, if you could take care of some tasks from `GlobalHub` project.
