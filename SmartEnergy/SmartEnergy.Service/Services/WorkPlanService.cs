using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SmartEnergy.Contract.CustomExceptions;
using SmartEnergy.Contract.CustomExceptions.Device;
using SmartEnergy.Contract.CustomExceptions.Incident;
using SmartEnergy.Contract.CustomExceptions.WorkPlan;
using SmartEnergy.Contract.CustomExceptions.WorkRequest;
using SmartEnergy.Contract.DTO;
using SmartEnergy.Contract.Enums;
using SmartEnergy.Contract.Interfaces;
using SmartEnergy.Infrastructure;
using SmartEnergyDomainModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Security.Principal;
using System.Text;


namespace SmartEnergy.Service.Services
{
    public class WorkPlanService : IWorkPlanService
    {
        private readonly SmartEnergyDbContext _dbContext;
        private readonly IMapper _mapper;
        private readonly IWorkRequestService _workRequestService;
        private readonly IIncidentService _incidentService;
        private readonly IDeviceUsageService _deviceUsageService;
        private readonly IAuthHelperService _authHelperService;
        private readonly IMultimediaService _multimediaService;

        public WorkPlanService(SmartEnergyDbContext dbContext, IMapper mapper,
            IIncidentService incidentService, IDeviceUsageService deviceUsageService,
            IAuthHelperService authHelperService, IMultimediaService multimedia, IWorkRequestService workRequestService)
        {
            _dbContext = dbContext;
            _mapper = mapper;
            _incidentService = incidentService;
            _deviceUsageService = deviceUsageService;
            _authHelperService = authHelperService;
            _multimediaService = multimedia;
            _workRequestService = workRequestService;
        }

        public void Delete(int id)
        {
            WorkPlan wp = _dbContext.WorkPlans.Include(x => x.MultimediaAnchor)
                                              .Include(x => x.NotificationAnchor)
                                              .Include(x => x.StateChangeAnchor)
                                              .FirstOrDefault(x => x.ID == id);

            if (wp == null)
                throw new WorkPlanNotFoundException($"Work plan with id {id} does not exist.");
            _dbContext.WorkPlans.Remove(wp);
            List<string> files = new List<string>();
            if(wp.MultimediaAnchor.MultimediaAttachments != null)
                foreach (MultimediaAttachment att in wp.MultimediaAnchor.MultimediaAttachments)
                    files.Add(att.Url);

            //Remove anchors
            _dbContext.MultimediaAnchors.Remove(wp.MultimediaAnchor);
            _dbContext.NotificationAnchors.Remove(wp.NotificationAnchor);
            _dbContext.StateChangeAnchors.Remove(wp.StateChangeAnchor);

            _dbContext.SaveChanges();

            foreach (string file in files)
                _multimediaService.DeleteWorkPlanFileOnDisk(id, file);
        }

        public WorkPlanDto Get(int id)
        {
            WorkPlan workPlan = _dbContext.WorkPlans.Find(id);

            if (workPlan == null)
                throw new WorkPlanNotFoundException($"Work plan with id {id} does not exist.");

            return _mapper.Map<WorkPlanDto>(workPlan);
        }

        public List<WorkPlanDto> GetAll()
        {
            return _mapper.Map<List<WorkPlanDto>>(_dbContext.WorkPlans.ToList());
        }

        public WorkPlansListDto GetWorkPlansPaged(WorkPlanField sortBy, SortingDirection direction, int page, int perPage, DocumentStatusFilter status, OwnerFilter owner, string searchParam, ClaimsPrincipal user)
        {
            IQueryable<WorkPlan> wrPaged = _dbContext.WorkPlans.Include(x => x.User).AsQueryable();

            wrPaged = FilterWorkPlansByStatus(wrPaged, status);
            wrPaged = FilterWorkPlansByOwner(wrPaged, owner, user);
            wrPaged = SearchWorkPlans(wrPaged, searchParam);
            wrPaged = SortWorkPlans(wrPaged, sortBy, direction);

            int resourceCount = wrPaged.Count();
            wrPaged = wrPaged.Skip(page * perPage)
                                    .Take(perPage);

            WorkPlansListDto returnValue = new WorkPlansListDto()
            {
                WorkPlans = _mapper.Map<List<WorkPlanDto>>(wrPaged.ToList()),
                TotalCount = resourceCount
            };

            return returnValue;
        }

        public WorkPlanDto Insert(WorkPlanDto entity)
        {
            ValidateWorkPlan(entity);

            MultimediaAnchor mAnchor = new MultimediaAnchor();

            StateChangeAnchor sAnchor = new StateChangeAnchor();

            NotificationAnchor nAnchor = new NotificationAnchor();

            StateChangeHistory stateChange = new StateChangeHistory()
            {
                DocumentStatus = DocumentStatus.DRAFT,
                UserID = entity.UserID,

            };

            sAnchor.StateChangeHistories = new List<StateChangeHistory>() { stateChange };

            WorkPlan workPlan = _mapper.Map<WorkPlan>(entity);
            workPlan.ID = 0;
            workPlan.MultimediaAnchor = mAnchor;
            workPlan.NotificationAnchor = nAnchor;
            workPlan.StateChangeAnchor = sAnchor;
            workPlan.DocumentStatus = DocumentStatus.DRAFT;
            
            _dbContext.WorkPlans.Add(workPlan);

            _dbContext.SaveChanges();

            _deviceUsageService.CopyWorkRequestDevicesToWorkPlan(workPlan.WorkRequestID, workPlan.ID);

            return _mapper.Map<WorkPlanDto>(workPlan);
        }

        public List<DeviceDto> GetWorkPlanDevices(int workPlanId)
        {
            WorkPlan workPlan = _dbContext.WorkPlans.Include(x => x.WorkPlanDevices)
                                                             .ThenInclude(x => x.Device)
                                                             .ThenInclude(x => x.Location)
                                                             .FirstOrDefault(x => x.ID == workPlanId);
            if (workPlan == null)
                throw new WorkPlanNotFoundException($"Work plan with id {workPlanId} does not exist.");

            List<Device> devices = new List<Device>();
            foreach (DeviceUsage d in workPlan.WorkPlanDevices)
                devices.Add(d.Device);

            return _mapper.Map<List<DeviceDto>>(devices);
        }

        public WorkPlanDto Update(WorkPlanDto entity)
        {
            ValidateWorkPlan(entity);
            WorkPlan existing = _dbContext.WorkPlans.Find(entity.ID);
            if (existing == null)
                throw new WorkPlanNotFoundException($"Work plan with id {entity.ID} does not exist");

            existing.Update(_mapper.Map<WorkPlan>(entity));

            _dbContext.SaveChanges();

            return _mapper.Map<WorkPlanDto>(existing);
        }

        private void ValidateWorkPlan(WorkPlanDto entity)
        {
            if (_dbContext.WorkRequests.Find(entity.WorkRequestID) == null)
            {
                throw new WorkPlanNotFoundException($"Attached work request with id {entity.WorkRequestID} does not exist.");
            }

            if (_dbContext.Users.Find(entity.UserID) == null)
                throw new UserNotFoundException($"Attached user with id {entity.UserID} does not exist.");

            WorkPlan wp = _dbContext.WorkPlans.FirstOrDefault(x => x.WorkRequestID == entity.WorkRequestID);
            if (wp != null && wp.ID != entity.ID)
                throw new WorkPlanInvalidStateException($"Work plan already created for work request with id {entity.WorkRequestID}");

            if (wp != null && (wp.DocumentStatus == DocumentStatus.APPROVED || wp.DocumentStatus == DocumentStatus.CANCELLED))
                throw new WorkPlanInvalidStateException($"Work request is in {wp.DocumentStatus.ToString()} state and cannot be edited.");

            if (entity.StartDate.CompareTo(entity.EndDate) > 0)
                throw new WorkPlanInvalidStateException($"Start date cannot be after end date.");

            if (entity.StartDate.CompareTo(DateTime.Now) < 0)
                throw new WorkPlanInvalidStateException($"Start date cannot be in the past.");

            if (entity.Purpose == null || entity.Purpose.Length > 100)
                throw new WorkPlanInvalidStateException($"Purpose must be at most 100 characters long and is required.");

            if (entity.Notes != null && entity.Notes.Length > 100)
                throw new WorkPlanInvalidStateException($"Note must be at most 100 characters long.");

            if (entity.CompanyName != null && entity.CompanyName.Length > 50)
                throw new WorkPlanInvalidStateException($"Company name must be at most 100 characters long.");

            if (entity.Phone != null && entity.Phone.Length > 30)
                throw new WorkPlanInvalidStateException($"Phone must be at most 30 characters long.");

            if (entity.Street != null && entity.Street.Length > 50)
                throw new WorkPlanInvalidStateException($"Street must be at most 50 characters long.");

            if (entity.Street == null || entity.Street != "")
            {
                try
                {
                    LocationDto location = _incidentService.GetIncidentLocation(_workRequestService.Get(entity.WorkRequestID).IncidentID);
                    entity.Street = location.Street + ", " + location.City;
                }
                catch { }
            }
        }


        private IQueryable<WorkPlan> FilterWorkPlansByStatus(IQueryable<WorkPlan> wp, DocumentStatusFilter status)
        {
            //Filter by status, ignore if ALL
            switch (status)
            {
                case DocumentStatusFilter.approved:
                    return wp.Where(x => x.DocumentStatus == DocumentStatus.APPROVED);
                case DocumentStatusFilter.canceled:
                    return wp.Where(x => x.DocumentStatus == DocumentStatus.CANCELLED);
                case DocumentStatusFilter.denied:
                    return wp.Where(x => x.DocumentStatus == DocumentStatus.DENIED);
                case DocumentStatusFilter.draft:
                    return wp.Where(x => x.DocumentStatus == DocumentStatus.DRAFT);
            }

            return wp;
        }

        private IQueryable<WorkPlan> FilterWorkPlansByOwner(IQueryable<WorkPlan> wp, OwnerFilter owner, ClaimsPrincipal user)
        {
            int userId = _authHelperService.GetUserIDFromPrincipal(user);
            if (owner == OwnerFilter.mine)
                wp = wp.Where(x => x.User.ID == userId);
            return wp;
        }


        private IQueryable<WorkPlan> SearchWorkPlans(IQueryable<WorkPlan> wr, string searchParam)
        {
            if (string.IsNullOrWhiteSpace(searchParam)) //Ignore empty search
                return wr;
            ///Perform search
            return wr.Where(x => x.Street.Contains(searchParam) ||
                                               x.StartDate.ToString().Contains(searchParam) ||
                                               x.EndDate.ToString().Contains(searchParam) ||
                                               x.User.Username.Contains(searchParam) ||
                                               x.CompanyName.Contains(searchParam) ||
                                               x.Phone.Contains(searchParam) ||
                                               x.CreatedOn.ToString().Contains(searchParam));
        }

        private IQueryable<WorkPlan> SortWorkPlans(IQueryable<WorkPlan> wr, WorkPlanField sortBy, SortingDirection direction)
        {
            //Sort
            if (direction == SortingDirection.asc)
            {
                switch (sortBy)
                {
                    case WorkPlanField.id:
                        return wr.OrderBy(x => x.ID);
                    case WorkPlanField.company:
                        return wr.OrderBy(x => x.CompanyName);
                    case WorkPlanField.createdby:
                        return wr.OrderBy(x => x.User.Username);
                    case WorkPlanField.creationdate:
                        return wr.OrderBy(x => x.CreatedOn);
                    case WorkPlanField.enddate:
                        return wr.OrderBy(x => x.EndDate);
                    case WorkPlanField.workrequest:
                        return wr.OrderBy(x => x.WorkRequestID);
                    case WorkPlanField.phoneno:
                        return wr.OrderBy(x => x.Phone);
                    case WorkPlanField.startdate:
                        return wr.OrderBy(x => x.StartDate);
                    case WorkPlanField.status:
                        return wr.OrderBy(x => x.DocumentStatus);
                    case WorkPlanField.street:
                        return wr.OrderBy(x => x.Street);
                    case WorkPlanField.type:
                        return wr.OrderBy(x => x.DocumentType);
                }

            }
            else
            {
                switch (sortBy)
                {
                    case WorkPlanField.id:
                        return wr.OrderByDescending(x => x.ID);
                    case WorkPlanField.company:
                        return wr.OrderByDescending(x => x.CompanyName);
                    case WorkPlanField.createdby:
                        return wr.OrderByDescending(x => x.User.Username);
                    case WorkPlanField.creationdate:
                        return wr.OrderByDescending(x => x.CreatedOn);
                    case WorkPlanField.enddate:
                        return wr.OrderByDescending(x => x.EndDate);
                    case WorkPlanField.workrequest:
                        return wr.OrderByDescending(x => x.WorkRequestID);
                    case WorkPlanField.phoneno:
                        return wr.OrderByDescending(x => x.Phone);
                    case WorkPlanField.startdate:
                        return wr.OrderByDescending(x => x.StartDate);
                    case WorkPlanField.status:
                        return wr.OrderByDescending(x => x.DocumentStatus);
                    case WorkPlanField.street:
                        return wr.OrderByDescending(x => x.Street);
                    case WorkPlanField.type:
                        return wr.OrderByDescending(x => x.DocumentType);
                }

            }

            return wr;
        }

        public List<InstructionDto> GetInstructions(int workPlanId)
        {
            return _mapper.Map<List<InstructionDto>>(_dbContext.Instructions.Where(x => x.WorkPlanID == workPlanId).ToList());
        }

        public void DeleteInstruction(int id)
        {
            Instruction wp = _dbContext.Instructions.FirstOrDefault(x => x.ID == id);

            if (wp == null)
                throw new WorkPlanNotFoundException($"Instruction with id {id} does not exist.");

            _dbContext.Instructions.Remove(wp);

            _dbContext.SaveChanges();

        }

        public void DeleteInstructions(int id)
        {
            foreach(Instruction i in _dbContext.Instructions.Where(x=> x.WorkPlanID == id))
            {
                _dbContext.Instructions.Remove(i);
            }

            _dbContext.SaveChanges();

        }

        public InstructionDto ApproveInstruction(int id, ClaimsPrincipal user)
        {
            int userID = _authHelperService.GetUserIDFromPrincipal(user);
            // TODO: Add user after authentication! 
            Instruction wr = _dbContext.Instructions.FirstOrDefault(x => x.ID == id);

            if (wr == null)
                throw new WorkPlanInvalidStateException($"Work plan with ID {id} deos not exist");

            wr.IsExecuted = true;

            _dbContext.SaveChanges();

            return _mapper.Map<InstructionDto>(wr);
        }

        public InstructionDto AddInstruction(InstructionDto entity)
        {

            Instruction inst = _mapper.Map<Instruction>(entity);
            inst.ID = 0;

            _dbContext.Instructions.Add(inst);

            _dbContext.SaveChanges();


            return _mapper.Map<InstructionDto>(inst);
        }
    }
}
