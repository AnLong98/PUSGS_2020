using SmartEnergy.Contract.DTO;
using SmartEnergy.Contract.Enums;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Text;

namespace SmartEnergy.Contract.Interfaces
{
    public interface IIncidentService : IGenericService<IncidentDto>
    {
        LocationDto GetIncidentLocation(int incidentId);

        IncidentDto AddCrewToIncident(int incidentId, int crewId);

        IncidentDto RemoveCrewFromIncidet(int incidentId);

        List<IncidentDto> GetUnassignedIncidents();

        void AddDeviceToIncident(int incidentId, int deviceId);

        void RemoveDeviceFromIncindet(int incidentId, int deviceId);
        List<IncidentMapDisplayDto> GetUnresolvedIncidentsForMap();

        List<CallDto> GetIncidentCalls(int incidentId);

        int GetNumberOfCalls(int incidentId);

        int GetNumberOfAffectedConsumers(int incidentId);

        List<DeviceDto> GetIncidentDevices(int incidentId);

        void SetIncidentPriority(int incidentId);

        List<DeviceDto> GetUnrelatedDevices(int incidentId);

        CrewDto GetIncidentCrew(int incidentId);

        CallDto AddIncidentCall(int incidentId, CallDto newCall);

        void AssignIncidetToUser(int incidentId, int userId);


        IncidentListDto GetIncidentsPaged(IncidentFields sortBy, SortingDirection direction, int page,
                               int perPage, IncidentFilter filter, OwnerFilter owner,
                               string searchParam, ClaimsPrincipal user);

         IncidentStatisticsDto GetStatisticsForUser(int userId);

         bool AddReportOutage(string hazard, string comment, int locationId, string callReason);
        //bool AddReportOutage(CallDto report);


    }
}
