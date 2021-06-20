using System;
using System.Collections.Generic;
using System.Text;

namespace SmartEnergy.Contract.CustomExceptions.WorkPlan
{
    public class WorkPlanInvalidStateException : Exception
    {
        public WorkPlanInvalidStateException(string message) : base(message)
        {
        }
    }
}
