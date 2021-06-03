﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SmartEnergy.Contract.CustomExceptions;
using SmartEnergy.Contract.CustomExceptions.SafetyDocument;
using SmartEnergy.Contract.CustomExceptions.WorkPlan;
using SmartEnergy.Contract.CustomExceptions.WorkRequest;
using SmartEnergy.Contract.DTO;
using SmartEnergy.Contract.Interfaces;

namespace SmartEnergyAPI.Controllers
{
    [Route("api/safety-documents")]
    [ApiController]
    public class SafetyDocumentController : ControllerBase
    {

        private readonly ISafetyDocumentService _safetyDocumentService;

        public SafetyDocumentController(ISafetyDocumentService safetyDocumentService)
        {
            _safetyDocumentService = safetyDocumentService;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(List<SafetyDocumentDto>))]
        public IActionResult GetAllSafetyDocuments()
        {
            return Ok(_safetyDocumentService.GetAll());

        }


        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(SafetyDocumentDto))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult GetSafetyDocumentById(int id)
        {
            try
            {
                SafetyDocumentDto sd = _safetyDocumentService.Get(id);

                return Ok(sd);

            }
            catch(SafetyDocumentNotFoundException sfnf)
            {
                return NotFound(sfnf.Message);
            }
           

            
        }


        [HttpGet("{id}/crew")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(SafetyDocumentDto))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult GetCrewForSafetyDocument(int id)
        {
            try
            {
                CrewDto crew = _safetyDocumentService.GetCrewForSafetyDocument(id);

                return Ok(crew);

            }
            catch (SafetyDocumentNotFoundException sfnf)
            {
                return NotFound(sfnf.Message);
            }



        }


        

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult AddSafetyDocument([FromBody] SafetyDocumentDto newSafetyDocument)
        {
            try
            {
                SafetyDocumentDto sf = _safetyDocumentService.Insert(newSafetyDocument);

                return CreatedAtAction(nameof(GetSafetyDocumentById), new { id = sf.ID }, sf);
            }
            catch (WorkPlanNotFoundException wpnf)
            {
                return NotFound(wpnf.Message);
            }
            catch (UserNotFoundException usernf)
            {
                return NotFound(usernf.Message);
            }
            catch (InvalidSafetyDocumentException invalid)
            {
                return NotFound(invalid.Message);
            }

        }


        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(SafetyDocumentDto))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult UpdateDevice(int id, [FromBody] SafetyDocumentDto modifiedSafetyDocument)
        {
            try
            {
                SafetyDocumentDto sf = _safetyDocumentService.Update(modifiedSafetyDocument);

                return Ok(sf);
            }
            catch (WorkPlanNotFoundException wpnf)
            {
                return NotFound(wpnf.Message);
            }
            catch (UserNotFoundException usernf)
            {
                return NotFound(usernf.Message);
            }
            catch (InvalidSafetyDocumentException invalid)
            {
                return BadRequest(invalid.Message);
            }
            catch(SafetyDocumentNotFoundException sfnf)
            {
                return NotFound(sfnf.Message);
            }
            catch(SafetyDocumentInvalidStateException sfinv)
            {
                return BadRequest(sfinv.Message);
            }
            


        }




        //[HttpDelete("{id}")]
        //[ProducesResponseType(StatusCodes.Status204NoContent)]
        //[ProducesResponseType(StatusCodes.Status404NotFound)]
        //public IActionResult RemoveSafetyDocument(int id)
        //{
        //    try
        //    {
        //        _safetyDocumentService.Delete(id);
        //        return NoContent();
        //    }
        //    catch (SafetyDocumentNotFoundException sfnf)
        //    {
        //        return NotFound(sfnf.Message);
        //    }
        //}


    }
}