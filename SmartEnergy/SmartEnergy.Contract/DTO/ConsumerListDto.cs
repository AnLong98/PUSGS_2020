using System;
using System.Collections.Generic;
using System.Text;

namespace SmartEnergy.Contract.DTO
{
    public class ConsumerListDto
    {
        public List<ConsumerDto> Consumers { get; set; }
        public int TotalCount { get; set; }
    }
}
