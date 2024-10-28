using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRMReact.Domain.Base.Exceptions
{
    public class DomainValidationException: Exception
    {
        public DomainValidationException(IEnumerable<ValidationResult> validators)
        {
            Validators = validators;
        }

        public IEnumerable<ValidationResult> Validators { get; private set; }
    }
}
