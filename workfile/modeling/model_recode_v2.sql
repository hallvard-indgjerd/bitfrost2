alter table model 
  add column `create_at` timestamp DEFAULT CURRENT_TIMESTAMP, 
  add column `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, 
  add column `updated_by` int NOT NULL;