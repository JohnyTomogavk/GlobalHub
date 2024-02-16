﻿namespace ProjectService.Application.Commands.ProjectItems.Base;

public abstract class BaseCreateProjectItemRequestHandler<TRequest, TResponse> : IRequestHandler<TRequest, TResponse>
    where TRequest : BaseProjectItemCreateRequest, IRequest<TResponse>
{
    private readonly ApplicationDbContext _dbContext;
    private readonly IValidator<TRequest> _validator;
    private readonly IMapper _mapper;
    private readonly IUserService _userService;
    private readonly IAuthorizationService<Project> _projectAuthorizationService;

    protected BaseCreateProjectItemRequestHandler(
        ApplicationDbContext dbContext,
        IValidator<TRequest> validator,
        IMapper mapper,
        IUserService userService,
        IAuthorizationService<Project> projectAuthorizationService)
    {
        this._dbContext = dbContext;
        this._validator = validator;
        this._mapper = mapper;
        this._userService = userService;
        this._projectAuthorizationService = projectAuthorizationService;
    }

    public async Task<TResponse> Handle(TRequest request, CancellationToken cancellationToken)
    {
        var isAuthorized =
            await this._projectAuthorizationService.AuthorizeUpdate(this._userService.UserId, request.ProjectId);

        if (!isAuthorized)
        {
            throw new UnauthorizedAccessException();
        }

        var validationResult = await this._validator.ValidateAsync(request, cancellationToken);

        if (!validationResult.IsValid)
        {
            throw new ValidationException(validationResult.Errors);
        }

        var projectItemToCreate = this._mapper.Map<ProjectItem>(request);
        await this._dbContext.ProjectItems.AddAsync(projectItemToCreate, cancellationToken);
        await this._dbContext.SaveChangesAsync(cancellationToken);
        await this.AssignTagsToProjectItem(projectItemToCreate.Id, request.TagIds, cancellationToken);

        return this._mapper.Map<TResponse>(projectItemToCreate);
    }

    private async Task AssignTagsToProjectItem(
        long projectItemIdId,
        IEnumerable<long> tagIds,
        CancellationToken cancellationToken)
    {
        var projectTags = tagIds.Select(tagId => new ProjectItemTag
        {
            ProjectItemId = projectItemIdId, TagId = tagId,
        });

        await this._dbContext.ProjectItemTags.AddRangeAsync(projectTags, cancellationToken);
        await this._dbContext.SaveChangesAsync(cancellationToken);
    }
}