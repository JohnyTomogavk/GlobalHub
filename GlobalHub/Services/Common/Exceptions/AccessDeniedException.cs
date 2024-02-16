namespace Common.Exceptions;

public class AccessDeniedException : Exception
{
    public AccessDeniedException(string message = "Access denied") : base(message)
    {
    }
}
