USE [ShopDb]

SET IDENTITY_INSERT [dbo].[category] ON 

INSERT [dbo].[category] ([Id], [Name], [Description]) VALUES (1, N'Cpu', N'Processors')
INSERT [dbo].[category] ([Id], [Name], [Description]) VALUES (2, N'Gpu', N'Graphics Cards')
INSERT [dbo].[category] ([Id], [Name], [Description]) VALUES (3, N'Motherboard', N'Motherboards')
INSERT [dbo].[category] ([Id], [Name], [Description]) VALUES (4, N'Ram', N'Memory')
INSERT [dbo].[category] ([Id], [Name], [Description]) VALUES (5, N'Storage', N'Storage Devices')
INSERT [dbo].[category] ([Id], [Name], [Description]) VALUES (6, N'Psu', N'Power Supplies')
INSERT [dbo].[category] ([Id], [Name], [Description]) VALUES (7, N'Case', N'Computer Cases')
INSERT [dbo].[category] ([Id], [Name], [Description]) VALUES (8, N'Cooling', N'Cooling Solutions')

SET IDENTITY_INSERT [dbo].[category] OFF
GO

SET IDENTITY_INSERT [dbo].[product] ON 

INSERT [dbo].[product] ([Id], [Name], [Description], [CategoryId], [Price], [Image]) VALUES (1, N'AMD Ryzen 9 7950X', N'16-core, 32-thread desktop processor with 5.7 GHz max boost, 170W TDP', 1, CAST(549.99 AS Decimal(18, 2)), N'assets/images/cpu-amd-7950x.svg')
INSERT [dbo].[product] ([Id], [Name], [Description], [CategoryId], [Price], [Image]) VALUES (2, N'AMD Ryzen 7 7800X3D', N'8-core gaming processor with 3D V-Cache, 5.0 GHz max boost', 1, CAST(349.99 AS Decimal(18, 2)), N'/assets/images/cpu-amd-7800x3d.svg')
INSERT [dbo].[product] ([Id], [Name], [Description], [CategoryId], [Price], [Image]) VALUES (3, N'Intel Core i9-14900K', N'24-core (8P+16E) desktop processor, 6.0 GHz max turbo', 1, CAST(549.00 AS Decimal(18, 2)), N'/assets/images/cpu-intel-14900k.svg')
INSERT [dbo].[product] ([Id], [Name], [Description], [CategoryId], [Price], [Image]) VALUES (4, N'Intel Core i5-14600K', N'14-core (6P+8E) processor, 5.3 GHz max turbo, great value', 1, CAST(279.99 AS Decimal(18, 2)), N'/assets/images/cpu-intel-14600k.svg')
INSERT [dbo].[product] ([Id], [Name], [Description], [CategoryId], [Price], [Image]) VALUES (5, N'NVIDIA GeForce RTX 4090', N'24GB GDDR6X, 16384 CUDA cores, ultimate 4K gaming', 2, CAST(1599.99 AS Decimal(18, 2)), N'/assets/images/gpu-rtx4090.svg')
INSERT [dbo].[product] ([Id], [Name], [Description], [CategoryId], [Price], [Image]) VALUES (6, N'NVIDIA GeForce RTX 4070 Super', N'12GB GDDR6X, excellent 1440p performance', 2, CAST(599.99 AS Decimal(18, 2)), N'/assets/images/gpu-rtx4070s.svg')
INSERT [dbo].[product] ([Id], [Name], [Description], [CategoryId], [Price], [Image]) VALUES (7, N'AMD Radeon RX 7900 XTX', N'24GB GDDR6, 96 compute units, high-end gaming', 2, CAST(899.99 AS Decimal(18, 2)), N'/assets/images/gpu-rx7900xtx.svg')
INSERT [dbo].[product] ([Id], [Name], [Description], [CategoryId], [Price], [Image]) VALUES (8, N'AMD Radeon RX 7600', N'8GB GDDR6, great 1080p gaming value', 2, CAST(249.99 AS Decimal(18, 2)), N'/assets/images/gpu-rx7600.svg')
INSERT [dbo].[product] ([Id], [Name], [Description], [CategoryId], [Price], [Image]) VALUES (9, N'ASUS ROG Strix Z790-E', N'LGA 1700, DDR5, PCIe 5.0, WiFi 6E, premium gaming board', 3, CAST(479.99 AS Decimal(18, 2)), N'/assets/images/mb-z790-hero.svg')
INSERT [dbo].[product] ([Id], [Name], [Description], [CategoryId], [Price], [Image]) VALUES (10, N'MSI MEG X670E Ace', N'AM5 socket, DDR5, PCIe 5.0, E-ATX flagship', 3, CAST(499.99 AS Decimal(18, 2)), N'/assets/images/mb-x670e-aorus.svg')
INSERT [dbo].[product] ([Id], [Name], [Description], [CategoryId], [Price], [Image]) VALUES (11, N'Gigabyte B650 Aorus Elite', N'AM5, DDR5, solid mid-range option for Ryzen 7000', 3, CAST(219.99 AS Decimal(18, 2)), N'/assets/images/mb-b650-tomahawk.svg')
INSERT [dbo].[product] ([Id], [Name], [Description], [CategoryId], [Price], [Image]) VALUES (12, N'ASRock B760M Pro RS', N'LGA 1700, Micro-ATX, DDR5, budget-friendly Intel board', 3, CAST(139.99 AS Decimal(18, 2)), N'/assets/images/mb-b760m-prors.svg')
INSERT [dbo].[product] ([Id], [Name], [Description], [CategoryId], [Price], [Image]) VALUES (13, N'G.Skill Trident Z5 RGB 32GB', N'DDR5-6000, CL30, 2x16GB kit, premium RGB RAM', 4, CAST(134.99 AS Decimal(18, 2)), N'/assets/images/ram-gskill-64gb.svg')
INSERT [dbo].[product] ([Id], [Name], [Description], [CategoryId], [Price], [Image]) VALUES (14, N'Corsair Dominator Platinum 32GB', N'DDR5-5600, CL36, 2x16GB, sleek white design', 4, CAST(129.99 AS Decimal(18, 2)), N'/assets/images/ram-corsair-32gb.svg')
INSERT [dbo].[product] ([Id], [Name], [Description], [CategoryId], [Price], [Image]) VALUES (15, N'Kingston Fury Beast 16GB', N'DDR5-5200, CL40, 2x8GB, budget-friendly option', 4, CAST(49.99 AS Decimal(18, 2)), N'/assets/images/ram-kingston-16gb.svg')
INSERT [dbo].[product] ([Id], [Name], [Description], [CategoryId], [Price], [Image]) VALUES (16, N'Samsung 990 Pro 2TB NVMe', N'PCIe 4.0, 7450 MB/s read, top-tier SSD', 5, CAST(179.99 AS Decimal(18, 2)), N'/assets/images/ssd-samsung-990pro.svg')
INSERT [dbo].[product] ([Id], [Name], [Description], [CategoryId], [Price], [Image]) VALUES (17, N'WD Black SN850X 2TB', N'PCIe 4.0, 7300 MB/s read, gaming-optimized SSD', 5, CAST(149.99 AS Decimal(18, 2)), N'/assets/images/ssd-wd-sn850x.svg')
INSERT [dbo].[product] ([Id], [Name], [Description], [CategoryId], [Price], [Image]) VALUES (18, N'Crucial T700 2TB', N'PCIe 5.0, 12400 MB/s read, next-gen NVMe', 5, CAST(299.99 AS Decimal(18, 2)), N'/assets/images/ssd-crucial-p3.svg')
INSERT [dbo].[product] ([Id], [Name], [Description], [CategoryId], [Price], [Image]) VALUES (19, N'Seagate Barracuda 4TB HDD', N'5400 RPM, 256MB cache, bulk storage', 5, CAST(79.99 AS Decimal(18, 2)), N'/assets/images/hdd-seagate-4tb.svg')
INSERT [dbo].[product] ([Id], [Name], [Description], [CategoryId], [Price], [Image]) VALUES (20, N'Corsair RM850x', N'850W, 80+ Gold, fully modular, ATX 3.0', 6, CAST(139.99 AS Decimal(18, 2)), N'/assets/images/psu-corsair-rm850x.svg')
INSERT [dbo].[product] ([Id], [Name], [Description], [CategoryId], [Price], [Image]) VALUES (21, N'Seasonic Focus GX-750', N'750W, 80+ Gold, fully modular, 10-year warranty', 6, CAST(109.99 AS Decimal(18, 2)), N'/assets/images/psu-bequiet-750w.svg')
INSERT [dbo].[product] ([Id], [Name], [Description], [CategoryId], [Price], [Image]) VALUES (22, N'be quiet! Dark Power 13 1000W', N'1000W, 80+ Titanium, premium silent PSU', 6, CAST(279.99 AS Decimal(18, 2)), N'/assets/images/psu-evga-1000w.svg')
INSERT [dbo].[product] ([Id], [Name], [Description], [CategoryId], [Price], [Image]) VALUES (23, N'NZXT H7 Flow', N'Mid-tower ATX, high airflow, clean cable management', 7, CAST(129.99 AS Decimal(18, 2)), N'/assets/images/case-nzxt-h7.svg')
INSERT [dbo].[product] ([Id], [Name], [Description], [CategoryId], [Price], [Image]) VALUES (24, N'Fractal Design North', N'Mid-tower ATX, wooden front panel, elegant design', 7, CAST(139.99 AS Decimal(18, 2)), N'/assets/images/case-fractal-north.svg')
INSERT [dbo].[product] ([Id], [Name], [Description], [CategoryId], [Price], [Image]) VALUES (25, N'Lian Li O11 Dynamic EVO', N'Dual-chamber mid-tower, showcase build, tempered glass', 7, CAST(169.99 AS Decimal(18, 2)), N'/assets/images/case-liani-o11.svg')
INSERT [dbo].[product] ([Id], [Name], [Description], [CategoryId], [Price], [Image]) VALUES (26, N'Noctua NH-D15', N'Dual-tower air cooler, 250W TDP, near-silent operation', 8, CAST(109.99 AS Decimal(18, 2)), N'/assets/images/cooling-noctua-d15.svg')
INSERT [dbo].[product] ([Id], [Name], [Description], [CategoryId], [Price], [Image]) VALUES (27, N'Arctic Liquid Freezer II 360', N'360mm AIO, VRM fan, excellent thermal performance', 8, CAST(109.99 AS Decimal(18, 2)), N'/assets/images/cooling-arctic-lf2.svg')
INSERT [dbo].[product] ([Id], [Name], [Description], [CategoryId], [Price], [Image]) VALUES (28, N'be quiet! Dark Rock Pro 5', N'Dual-tower, 270W TDP, ultra-quiet 23.6 dBA', 8, CAST(89.99 AS Decimal(18, 2)), N'/assets/images/cooling-corsair-h150i.svg')
SET IDENTITY_INSERT [dbo].[product] OFF