using CRMReact.Domain.Base.Exceptions;
using Microsoft.AspNetCore.Diagnostics;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace CRMReact.Server.Handlers
{
    public class DomainValidationExceptionHandler : IExceptionHandler
    {
        private readonly ILogger<DomainValidationExceptionHandler> logger;
        public DomainValidationExceptionHandler(ILogger<DomainValidationExceptionHandler> logger)
        {
            this.logger = logger;
        }
        public ValueTask<bool> TryHandleAsync(
            HttpContext httpContext,
            Exception exception,
            CancellationToken cancellationToken)
        {
            var exceptionMessage = exception.Message;
            logger.LogError(
                "Error Message: {exceptionMessage}, Time of occurrence {time}",
                exceptionMessage, DateTime.UtcNow);
            // Return false to continue with the default behavior
            // - or - return true to signal that this exception is handled
            if (exception is DomainValidationException)
            {
                httpContext.Response.WriteAsJsonAsync(string.Join(" - ", ((DomainValidationException)exception).Validators.Select(x=>x.ErrorMessage)), cancellationToken);
                return ValueTask.FromResult(true);
            }
            return ValueTask.FromResult(false);
        }
    }
}
