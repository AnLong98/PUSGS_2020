﻿using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartEnergyDomainModels;
using System;
using System.Collections.Generic;
using System.Text;

namespace SmartEnergy.Infrastructure.Configurations
{
    public class ConsumerConfiguration : IEntityTypeConfiguration<Consumer>
    {
        public void Configure(EntityTypeBuilder<Consumer> builder)
        {
            //Set table name mapping
            // builder.ToTable("ListItems");

            //Set FK
            builder.HasKey(i => i.ID);


            builder.Property(i => i.Name)
                .IsRequired(true)
                .HasMaxLength(30);

            builder.Property(i => i.Lastname)
               .IsRequired(true)
               .HasMaxLength(30);

            builder.Property(i => i.Phone)
               .IsRequired(true)
               .HasMaxLength(30);

            builder.Property(i => i.AccountID)
               .IsRequired(true);

            builder.Property(i => i.AccountType)
               .IsRequired(true);


            builder.HasOne(i => i.User)
             .WithOne(p => p.Consumer)
             .HasForeignKey<User>(i => i.ConsumerID)
             .HasForeignKey<Consumer>(i => i.UserID)
             .IsRequired(false);

            builder.HasOne(i => i.Location)
             .WithMany(p => p.Consumers)
             .HasForeignKey(i => i.LocationID)
             .IsRequired(true);










        }
    }
}
