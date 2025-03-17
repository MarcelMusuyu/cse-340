-- Insert data in the account table
SELECT * FROM public.inventory
WHERE classification_id=1
ORDER BY inv_id ASC; 

INSERT INTO public.account (account_firstname,account_lastname,account_email,account_password)
VALUES ('Tony', 'Start','tony@startent.com','Iam1ronM@n');

SELECT * FROM public.account
ORDER BY account_id ASC; 

UPDATE public.account
SET account_type ='Admin'
WHERE account_id=1;

DELETE FROM public.account
WHERE account_id=1;

-- 1. Modify the "GM Hummer" record to read "a huge interior" rather than "small interiors" using a single query.

UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make ='GM' AND inv_model ='Hummer';


-- 2. Use an inner join to select the make and model fields from the inventory table and the classification name field from the classification table for inventory items that belong to the "Sport" category.

SELECT i.inv_make, i.inv_model, c.classification_name
FROM public.inventory i
INNER JOIN public.classification c ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';

-- 3. Update all records in the inventory table to add "/vehicles" to the middle of the file path in the inv_image and inv_thumbnail columns using a single query.

UPDATE public.inventory
SET
    inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');