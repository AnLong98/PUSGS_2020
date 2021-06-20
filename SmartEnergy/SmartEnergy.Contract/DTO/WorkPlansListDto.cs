using System;
using System.Collections.Generic;
using System.Text;

namespace SmartEnergy.Contract.DTO
{
    public class WorkPlansListDto
    {
        public List<WorkPlanDto> WorkPlans { get; set; }
        public int TotalCount { get; set; }
    }
}
