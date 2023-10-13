namespace Common.ExceptionHandling;

public class ExceptionHandlingMiddleware
{
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;
    private readonly RequestDelegate _next;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext httpContext)
    {
        try
        {
            await _next(httpContext);
        }
        catch (EntityNotFoundException entityNotFoundException)
        {
            await HandleEntityNotFoundException(httpContext, entityNotFoundException);
        }
        catch (ValidationException validationException)
        {
            await HandleValidationException(httpContext, validationException);
        }
        catch (Exception exception)
        {
            await HandleExceptionAsync(httpContext, exception);
        }
    }

    private async Task HandleEntityNotFoundException(HttpContext httpContext, Exception ex)
    {
        httpContext.Response.ContentType = MediaTypeNames.Application.Json;
        httpContext.Response.StatusCode = (int)HttpStatusCode.NoContent;

        var response =
            new CustomResponse
            {
                Message = ex.Message, StatusCode = (int)HttpStatusCode.NoContent, Details = "Entity not found"
            };
        var serializedResponse = JsonSerializer.Serialize(response);
        await httpContext.Response.WriteAsync(serializedResponse);
        LogException(ex);
    }

    private async Task HandleValidationException(HttpContext httpContext, Exception ex)
    {
        httpContext.Response.ContentType = MediaTypeNames.Application.Json;
        httpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;

        var response =
            new CustomResponse
            {
                Message = ex.Message, StatusCode = (int)HttpStatusCode.BadRequest, Details = "Validation exception"
            };

        var serializedResponse = JsonSerializer.Serialize(response);
        await httpContext.Response.WriteAsync(serializedResponse);
        LogException(ex);
    }

    private async Task HandleExceptionAsync(HttpContext httpContext, Exception ex)
    {
        httpContext.Response.ContentType = MediaTypeNames.Application.Json;
        httpContext.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

        var response =
            new CustomResponse
            {
                Message = ex.Message,
                StatusCode = (int)HttpStatusCode.InternalServerError,
                Details = "Internal Server Error"
            };
        var serializedResponse = JsonSerializer.Serialize(response);
        await httpContext.Response.WriteAsync(serializedResponse);
        LogException(ex);
    }

    private void LogException(Exception e)
    {
        _logger.LogError(e, e.Message);
    }
}
