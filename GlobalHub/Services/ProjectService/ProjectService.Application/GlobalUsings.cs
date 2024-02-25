﻿global using System.Linq.Expressions;
global using AutoMapper;
global using AutoMapper.AspNet.OData;
global using Common.Exceptions;
global using Common.Services.Abstract;
global using FluentValidation;
global using FluentValidation.Results;
global using Hangfire;
global using MediatR;
global using Microsoft.AspNetCore.OData.Query;
global using Microsoft.EntityFrameworkCore;
global using Microsoft.Extensions.DependencyInjection;
global using ProjectService.Application.Authorization.Interfaces;
global using ProjectService.Application.Commands.ProjectItems;
global using ProjectService.Application.Commands.ProjectItems.Base;
global using ProjectService.Application.Commands.Tags;
global using ProjectService.Application.Dto;
global using ProjectService.Application.Interfaces;
global using ProjectService.Application.Queries;
global using ProjectService.Application.Requests;
global using ProjectService.Domain.Entities.Base;
global using ProjectService.Domain.Entities.ProjectItems;
global using ProjectService.Domain.Entities.Projects;
global using ProjectService.Domain.Entities.Tags;
global using ProjectService.Domain.Enums;
global using ProjectService.Infrastructure.Services.Interfaces;
global using ProjectService.Persistence.Contexts;
