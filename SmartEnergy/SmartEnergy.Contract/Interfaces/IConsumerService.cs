using SmartEnergy.Contract.DTO;
using SmartEnergy.Contract.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace SmartEnergy.Contract.Interfaces
{
    public interface IConsumerService : IGenericService<ConsumerDto>
    {
        public ConsumerListDto GetConsumersPaged(ConsumerField sortBy, SortingDirection direction, int page, int perPage,
            AccountTypeFilter type, string searchParam);

        public bool Insert(string name, string lastname, int locationID, string accountID, string phone, string accountType);
    }

   
   
}
