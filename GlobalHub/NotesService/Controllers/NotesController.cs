using Microsoft.AspNetCore.Mvc;
using NotesService.Models;

namespace NotesService.Controllers;

[ApiController]
[Route("[controller]")]
public class NotesController : ControllerBase
{
    private readonly ILogger<NotesController> _logger;

    public NotesController(ILogger<NotesController> logger)
    {
        this._logger = logger;
    }

    [HttpGet(Name = "GetWeatherForecast")]
    public IEnumerable<Note> Get()
    {
        return Enumerable.Range(1, 5).Select(index => new Note
            {
                CreationDate = default, UpdatedDate = default, Title = null, MarkdownContent = null
            })
            .ToArray();
    }
}
