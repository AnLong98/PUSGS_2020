using AutoMapper;
using SmartEnergy.Contract.CustomExceptions.Device;
using SmartEnergy.Contract.DTO;
using SmartEnergy.Contract.Interfaces;
using SmartEnergy.Infrastructure;
using SmartEnergyDomainModels;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;

namespace SmartEnergy.Service.Services
{
    public class NotificationService : INotificationService
    {
        private readonly SmartEnergyDbContext _dbContext;
        private readonly IMapper _mapper;

        public NotificationService(SmartEnergyDbContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }

        public void Delete(int id)
        {
            Notification not = _dbContext.Notifications.Include(x=> x.NotificationAnchor)
                                                        .FirstOrDefault(x => x.ID.Equals(id));

            if(not == null)
                throw new DeviceNotFoundException($"Notification with Id = {id} does not exists!");

            _dbContext.Notifications.Remove(not);

            //_dbContext.NotificationAnchors.Remove(not.NotificationAnchor);

            _dbContext.SaveChanges();

        }

        public void DeleteAll()
        {
            foreach(Notification n in _dbContext.Notifications)
            {
                try
                {
                    Delete(n.ID);
                }
                catch
                {
                    
                }
            }

        }

        public NotificationDto Get(int id)
        {
            Incident not = _dbContext.Incidents.Find(id);

            if (not == null)
                throw new DeviceNotFoundException($"Notification with id {id} does not exist.");

            return _mapper.Map<NotificationDto>(not);

        }

        public List<NotificationDto> GetAll()
        {
            return _mapper.Map<List<NotificationDto>>(_dbContext.Notifications.ToList());
        }

        public NotificationDto Insert(NotificationDto entity)
        {
            NotificationAnchor nAnchor = new NotificationAnchor();

            Notification not = _mapper.Map<Notification>(entity);
            not.ID = 0;
            not.NotificationAnchor = nAnchor;

            _dbContext.Notifications.Add(not);

            return _mapper.Map<NotificationDto>(not);
        }

        public NotificationDto Update(NotificationDto entity)
        {
            Notification oldNot = _dbContext.Notifications.Find(entity.ID);

            if(oldNot == null)
                throw new DeviceNotFoundException($"Notification with id {entity.ID} does not exist.");

            Notification not = _mapper.Map<Notification>(entity);

            oldNot.Update(_mapper.Map<Notification>(not));

            _dbContext.SaveChanges();

            return _mapper.Map<NotificationDto>(oldNot);
        }
    }
}
