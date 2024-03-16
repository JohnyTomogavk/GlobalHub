// Global using directives

global using System.Net;
global using System.Net.Mime;
global using System.Security.Claims;
global using System.Text.Json;
global using System.Text.Json.Serialization;
global using Common.EventBus.Enums;
global using Common.EventBus.Messages.FullTextSearchModels.Base;
global using Common.EventBus.Messages.FullTextSearchModels.Budgets;
global using Common.EventBus.Messages.FullTextSearchModels.Notes;
global using Common.EventBus.Messages.FullTextSearchModels.Projects;
global using Common.EventBus.Messages.Notifications.Base;
global using Common.Exceptions;
global using Common.Services.Abstract;
global using DotNetEnv;
global using DotNetEnv.Configuration;
global using FluentValidation;
global using MassTransit;
global using Microsoft.AspNetCore.Http;
global using Microsoft.Extensions.Configuration;
global using Microsoft.Extensions.Hosting;
global using Microsoft.Extensions.Logging;
global using Nest;
global using Serilog;
global using Serilog.Sinks.Elasticsearch;
