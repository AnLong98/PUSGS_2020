﻿using SmartEnergy.Contract.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace SmartEnergyDomainModels
{
    public class Device
    {
        public int ID { get; set; }
        public DeviceType DeviceType { get; set; }
        public string Name { get; set; }
        public int LocationID { get; set; }
        public Location Location { get; set; }
        public List<DeviceUsage> DeviceUsage { get; set; }
        public List<Instruction> Instructions { get; set; }

    }
}
