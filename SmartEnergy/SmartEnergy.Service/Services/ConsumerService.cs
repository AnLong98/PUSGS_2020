using AutoMapper;
using SmartEnergy.Contract.DTO;
using SmartEnergy.Contract.Interfaces;
using SmartEnergy.Infrastructure;
using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using SmartEnergy.Contract.Enums;
using SmartEnergyDomainModels;
using SmartEnergy.Contract.CustomExceptions.Consumer;

namespace SmartEnergy.Service.Services
{
    public class ConsumerService : IConsumerService
    {

        private readonly SmartEnergyDbContext _dbContext;
        private readonly IMapper _mapper;

        public ConsumerService(SmartEnergyDbContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }

        public void Delete(int id)
        {
            Consumer consumer = _dbContext.Consumers.FirstOrDefault(x => x.ID == id);

            if (consumer == null)
                throw new ConsumerNotFoundException($"Consumer with id {id} does not exist.");

            _dbContext.Consumers.Remove(consumer);

            _dbContext.SaveChanges();
        }

        public ConsumerDto Get(int id)
        {
            Consumer consumer = _dbContext.Consumers.Find(id);

            if (consumer == null)
                throw new ConsumerNotFoundException($"Consumer with id {id} does not exist.");

            return _mapper.Map<ConsumerDto>(consumer);
        }

        public List<ConsumerDto> GetAll()
        {
            return _mapper.Map<List<ConsumerDto>>(_dbContext.Consumers.Include("Location").ToList());

        }

        public bool Insert(string name, string lastname, int locationID, string accountID, string accountType, string phone)
        {
            try
            {
                ConsumerDto consumer = new ConsumerDto();
                consumer.Name = name;
                consumer.Lastname = lastname;
                consumer.LocationID = locationID;
                consumer.AccountID = accountID;
                consumer.Phone = phone;
                consumer.AccountType = accountType;

                consumer.ID = 0;

                Consumer c = _mapper.Map<Consumer>(consumer);

                _dbContext.Consumers.Add(c);
                _dbContext.SaveChanges();

                return true;
            }
            catch
            {

            }

            return false;
        }

        public ConsumerDto Update(ConsumerDto entity)
        {
            Consumer existing = _dbContext.Consumers.Find(entity.ID);
            if (existing == null)
                throw new ConsumerNotFoundException($"Consumer with id {entity.ID} does not exist");

            existing.Update(_mapper.Map<Consumer>(entity));

            _dbContext.SaveChanges();

            return _mapper.Map<ConsumerDto>(existing);
        }

        public ConsumerListDto GetConsumersPaged(ConsumerField sortBy, SortingDirection direction, int page, int perPage,
            AccountTypeFilter type, string searchParam)
        {
            IQueryable<Consumer> wrPaged = _dbContext.Consumers.AsQueryable();

            wrPaged = FilterConsumersByType(wrPaged, type);
            wrPaged = SearchConsumers(wrPaged, searchParam);
            wrPaged = SortConsumers(wrPaged, sortBy, direction);

            int resourceCount = wrPaged.Count();
            wrPaged = wrPaged.Skip(page * perPage)
                                    .Take(perPage);

            ConsumerListDto returnValue = new ConsumerListDto()
            {
                Consumers = _mapper.Map<List<ConsumerDto>>(wrPaged.ToList()),
                TotalCount = resourceCount
            };

            return returnValue;
        }

        private IQueryable<Consumer> FilterConsumersByType(IQueryable<Consumer> wr, AccountTypeFilter type)
        {
            //Filter by status, ignore if ALL
            switch (type)
            {
                case AccountTypeFilter.RESIDENTAL:
                    return wr.Where(x => x.AccountType == AccountType.RESIDENTAL);
                case AccountTypeFilter.NONRESIDENTAL:
                    return wr.Where(x => x.AccountType == AccountType.NONRESIDENTAL);
            }

            return wr;
        }

        private IQueryable<Consumer> SearchConsumers(IQueryable<Consumer> wr, string searchParam)
        {
            if (string.IsNullOrWhiteSpace(searchParam)) //Ignore empty search
                return wr;
            ///Perform search
            return wr.Where(x => x.Lastname.Contains(searchParam) ||
                                               x.Phone.Contains(searchParam) ||
                                               x.Name.Contains(searchParam) ||
                                               x.LocationID.ToString().Contains(searchParam) ||
                                               x.ID.ToString().Contains(searchParam) ||
                                               x.Phone.Contains(searchParam) ||
                                               x.AccountType.ToString().Contains(searchParam) ||
                                               x.AccountID.Contains(searchParam));
        }

        private IQueryable<Consumer> SortConsumers(IQueryable<Consumer> wr, ConsumerField sortBy, SortingDirection direction)
        {
            //Sort
            if (direction == SortingDirection.asc)
            {
                switch (sortBy)
                {
                    case ConsumerField.id:
                        return wr.OrderBy(x => x.ID);
                    case ConsumerField.name:
                        return wr.OrderBy(x => x.Name);
                    case ConsumerField.lastname:
                        return wr.OrderBy(x => x.Lastname);
                    case ConsumerField.phone:
                        return wr.OrderBy(x => x.Phone);
                    case ConsumerField.locationid:
                        return wr.OrderBy(x => x.LocationID);
                    case ConsumerField.accounttype:
                        return wr.OrderBy(x => x.AccountType);
                    case ConsumerField.accountid:
                        return wr.OrderBy(x => x.AccountID);
                }

            }
            else
            {
                switch (sortBy)
                {
                    case ConsumerField.id:
                        return wr.OrderByDescending(x => x.ID);
                    case ConsumerField.name:
                        return wr.OrderByDescending(x => x.Name);
                    case ConsumerField.lastname:
                        return wr.OrderByDescending(x => x.Lastname);
                    case ConsumerField.phone:
                        return wr.OrderByDescending(x => x.Phone);
                    case ConsumerField.locationid:
                        return wr.OrderByDescending(x => x.LocationID);
                    case ConsumerField.accounttype:
                        return wr.OrderByDescending(x => x.AccountType);
                    case ConsumerField.accountid:
                        return wr.OrderByDescending(x => x.AccountID);
                }

            }

            return wr;
        }

        public ConsumerDto Insert(ConsumerDto entity)
        {
            throw new NotImplementedException();
        }

    }
}
