using System;
using System.Collections.Generic;
using System.Text;

namespace SmartEnergy.Contract.DTO
{
    public class NotificationDto
    {
        public int ID { get; set; }
        public string NotificationType { get; set; }
        public string Description { get; set; }
        public DateTime Timestamp{get;set;}
        public bool isRead { get; set; }
        public int? UserID { get; set; }
    }
}
