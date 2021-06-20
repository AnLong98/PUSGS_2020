using SmartEnergy.Contract.DTO;
using SmartEnergy.Contract.Interfaces;
using SmartEnergy.Infrastructure;
using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using AutoMapper;
using SmartEnergyDomainModels;
using SmartEnergy.Contract.CustomExceptions.Location;

namespace SmartEnergy.Service.Services
{
    public class LocationService : ILocationService
    {
        private readonly SmartEnergyDbContext _dbContext;
        private readonly IMapper _mapper;

        public LocationService(SmartEnergyDbContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }

        public List<LocationDto> GetAllLocations()
        {
            return _mapper.Map<List<LocationDto>>(_dbContext.Location.ToList());
        }

        public bool ChangePriorities(List<LocationDto> locations)
        {
            foreach(LocationDto loc in locations)
            {
                Location l = _dbContext.Location.Find(loc.ID);

                if (l == null)
                {
                    throw new LocationNotFoundException($"Location with {loc.ID} Id does not exists.");
                }

                l.UpdateLocation(_mapper.Map<Location>(loc));

                _dbContext.SaveChanges();

            }

            return true;

        }
    }
}
