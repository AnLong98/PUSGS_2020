using System;
using System.Collections.Generic;
using System.Text;

namespace SmartEnergy.Contract.DTO
{
    public class WorkPlanDto
    {
        public int ID { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public DateTime CreatedOn { get; set; }
        public string Purpose { get; set; }
        public string Notes { get; set; }
        public string CompanyName { get; set; }
        public string Phone { get; set; }
        public string Street { get; set; }
        public string DocumentType { get; set; }
        public string DocumentStatus { get; set; }
        public int UserID { get; set; }
        public int WorkRequestID { get; set; }

    }
}
