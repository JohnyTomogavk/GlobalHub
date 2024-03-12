﻿namespace ProjectService.Application.Commands.Projects;

public record CreateProjectRequest : IRequest<ProjectDto>;

/// <summary>
/// Handles project creating
/// </summary>
public class CreateProjectHandler : IRequestHandler<CreateProjectRequest, ProjectDto>
{
    private readonly ApplicationDbContext _applicationDbContext;
    private readonly IMapper _mapper;
    private readonly IFullTextIndexService<Project> _fullTextIndexService;

    public CreateProjectHandler(
        ApplicationDbContext applicationDbContext,
        IMapper mapper,
        IFullTextIndexService<Project> fullTextIndexService)
    {
        this._applicationDbContext = applicationDbContext;
        this._mapper = mapper;
        this._fullTextIndexService = fullTextIndexService;
    }

    public async Task<ProjectDto> Handle(CreateProjectRequest request, CancellationToken cancellationToken)
    {
        var project = new Project();
        var entityEntry = await this._applicationDbContext.AddAsync(project, cancellationToken);
        await this._applicationDbContext.SaveChangesAsync(cancellationToken);
        var updatedProjectDto = this._mapper.Map<ProjectDto>(entityEntry.Entity);
        await this._fullTextIndexService.IndexCreatedEntity(updatedProjectDto.Id);

        return updatedProjectDto;
    }
}
