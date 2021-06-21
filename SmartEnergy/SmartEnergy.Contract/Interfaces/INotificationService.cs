using SmartEnergy.Contract.DTO;
using System;
using System.Collections.Generic;
using System.Text;

namespace SmartEnergy.Contract.Interfaces
{
    public interface INotificationService : IGenericService<NotificationDto>
    {
        public void DeleteAll();
    }
}
