﻿// <auto-generated />
using System;
using BudgetsService.DataAccess.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace BudgetsService.DataAccess.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20230830232500_UpdateBudgetItemColumns")]
    partial class UpdateBudgetItemColumns
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.9")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("BudgetsService.DataAccess.Entities.Budgets.Budget", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<long>("Id"));

                    b.Property<string>("BudgetDescription")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("BudgetTitle")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTime>("CreatedDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<int>("PreserveFromIncomingPercent")
                        .HasColumnType("integer");

                    b.Property<DateTime?>("UpdatedDate")
                        .HasColumnType("timestamp with time zone");

                    b.HasKey("Id");

                    b.ToTable("Budgets");
                });

            modelBuilder.Entity("BudgetsService.DataAccess.Entities.Budgets.BudgetItem", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<long>("Id"));

                    b.Property<long>("BudgetId")
                        .HasColumnType("bigint");

                    b.Property<int>("BudgetItemOperationType")
                        .HasColumnType("integer");

                    b.Property<int>("BudgetItemRegularityType")
                        .HasColumnType("integer");

                    b.Property<DateTime>("CreatedDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("ItemDescription")
                        .HasColumnType("text");

                    b.Property<string>("ItemTitle")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<decimal>("OperationCost")
                        .HasColumnType("numeric");

                    b.Property<DateTime>("OperationDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<DateTime?>("UpdatedDate")
                        .HasColumnType("timestamp with time zone");

                    b.HasKey("Id");

                    b.HasIndex("BudgetId");

                    b.ToTable("BudgetsItems");
                });

            modelBuilder.Entity("BudgetsService.DataAccess.Entities.Tags.BudgetItemTag", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<long>("Id"));

                    b.Property<long>("BudgetItemId")
                        .HasColumnType("bigint");

                    b.Property<long>("TagId")
                        .HasColumnType("bigint");

                    b.HasKey("Id");

                    b.HasIndex("BudgetItemId");

                    b.HasIndex("TagId");

                    b.ToTable("BudgetItemTags");
                });

            modelBuilder.Entity("BudgetsService.DataAccess.Entities.Tags.Tag", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<long>("Id"));

                    b.Property<long>("BudgetId")
                        .HasColumnType("bigint");

                    b.Property<string>("Color")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Label")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("BudgetId");

                    b.ToTable("Tags");
                });

            modelBuilder.Entity("BudgetsService.DataAccess.Entities.Budgets.BudgetItem", b =>
                {
                    b.HasOne("BudgetsService.DataAccess.Entities.Budgets.Budget", "Budget")
                        .WithMany("BudgetItems")
                        .HasForeignKey("BudgetId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Budget");
                });

            modelBuilder.Entity("BudgetsService.DataAccess.Entities.Tags.BudgetItemTag", b =>
                {
                    b.HasOne("BudgetsService.DataAccess.Entities.Budgets.BudgetItem", "BudgetItem")
                        .WithMany("BudgetItemTags")
                        .HasForeignKey("BudgetItemId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("BudgetsService.DataAccess.Entities.Tags.Tag", "Tag")
                        .WithMany("BudgetItems")
                        .HasForeignKey("TagId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("BudgetItem");

                    b.Navigation("Tag");
                });

            modelBuilder.Entity("BudgetsService.DataAccess.Entities.Tags.Tag", b =>
                {
                    b.HasOne("BudgetsService.DataAccess.Entities.Budgets.Budget", "Budget")
                        .WithMany("BudgetTags")
                        .HasForeignKey("BudgetId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Budget");
                });

            modelBuilder.Entity("BudgetsService.DataAccess.Entities.Budgets.Budget", b =>
                {
                    b.Navigation("BudgetItems");

                    b.Navigation("BudgetTags");
                });

            modelBuilder.Entity("BudgetsService.DataAccess.Entities.Budgets.BudgetItem", b =>
                {
                    b.Navigation("BudgetItemTags");
                });

            modelBuilder.Entity("BudgetsService.DataAccess.Entities.Tags.Tag", b =>
                {
                    b.Navigation("BudgetItems");
                });
#pragma warning restore 612, 618
        }
    }
}
