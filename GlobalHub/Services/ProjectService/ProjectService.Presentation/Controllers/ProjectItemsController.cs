﻿namespace ProjectService.Presentation.Controllers;

/// <summary>
/// Controller that manages project items
/// </summary>
[ApiController]
[Route("api/v1/[controller]/[action]")]
public class ProjectItemsController : BaseController<ProjectItem, ProjectItemDto>
{
    private readonly IMediator _mediator;

    public ProjectItemsController(IMediator mediator)
        : base(mediator)
    {
        this._mediator = mediator;
    }

    /// <summary>
    /// Creates task on project
    /// </summary>
    /// <param name="createTaskRequest">Task's data.</param>
    /// <returns>Created task mapped to project item.</returns>
    [HttpPost]
    public async Task<ActionResult<ProjectItemDto>> CreateProjectTask([FromBody] CreateTaskRequest createTaskRequest)
    {
        var createdTask = await this._mediator.Send(createTaskRequest);

        return this.StatusCode(StatusCodes.Status201Created, createdTask);
    }

    /// <summary>
    /// Creates event on project
    /// </summary>
    /// <param name="createEventRequest">Event's data.</param>
    /// <returns>Created event mapped to project item.</returns>
    [HttpPost]
    public async Task<ActionResult<ProjectItemDto>> CreateProjectEvent([FromBody] CreateEventRequest createEventRequest)
    {
        var createdEvent = await this._mediator.Send(createEventRequest);

        return this.StatusCode(StatusCodes.Status201Created, createdEvent);
    }
}
