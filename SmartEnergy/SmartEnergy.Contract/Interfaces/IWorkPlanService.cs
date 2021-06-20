using SmartEnergy.Contract.DTO;
using SmartEnergy.Contract.Enums;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Text;

namespace SmartEnergy.Contract.Interfaces
{
    public interface IWorkPlanService : IGenericService<WorkPlanDto>
    {
        public WorkPlansListDto GetWorkPlansPaged(WorkPlanField sortBy, SortingDirection direction, int page,
                                  int perPage, DocumentStatusFilter status, OwnerFilter owner,
                                  string searchParam, ClaimsPrincipal user);
        public List<DeviceDto> GetWorkPlanDevices(int workPlanId);
        public List<InstructionDto> GetInstructions(int workPlanId);
        public InstructionDto ApproveInstruction(int id, ClaimsPrincipal user);
        public void DeleteInstruction(int id);
        public void DeleteInstructions(int id);
        public InstructionDto AddInstruction(InstructionDto entity);


    }
}
