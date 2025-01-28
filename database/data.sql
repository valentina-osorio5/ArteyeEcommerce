INSERT INTO "users" ("userId", "username", "password", "createdAt")
VALUES
(1, 'john_doe', 'password123', '2025-01-01 12:00:00'),
(2, 'jane_smith', 'password456', '2025-01-02 14:30:00');


INSERT INTO "products" ("productId","productName", "description", "imageUrl", "price")
VALUES
(3, 'Jean-Michel Basquiat Neon Sign', 'Based on artist Jean-Michel Basquiat 1984 painting Pez Dispenser, this innovative take on a neon sign from the brand Yellowpop is made from flexible, energy-efficient LED tubing that’s extremely durable. It’s digitally printed using vibrant pigments on precision-cut acrylic backers, and the LED tubes are molded to the image and mounted securely. The Pez Dispenser Neon Sign measures 15.7h x 19.6”w.', 'https://store.moma.org/cdn/shop/files/f2521c78-2eca-48d5-913c-b9ab5b92cde4_360x.jpg?v=1707238030',150.00),
(4, 'Salvador Dalí Gold-Plated Melting Clock Post Earrings', 'These Melting Clock Post Earrings are inspired by the symbolic elements of artist Salvador Dalí’s The Persistence of Memory (1931). They take on the shape of limp watches, which the artist once described as “the camembert of time,” a comparison to soft, overripe cheese. Designed by Barcelona-based, family-owned jewelry brand Joidart, this 24k gold-plated brass pair can be worn to make a subtle surrealist statement or teamed with the matching platinum-plated necklace for a bit more impact. The Salvador Dalí Melting Clock Post Earrings each measure 0.75l x 0.35"w', 'https://store.moma.org/cdn/shop/files/84607c5e-c4ae-4ed2-866d-d089c4ed65b0_720x.jpg?v=1723812748',50.00 ),
(5, 'Acorn Vase', 'Best seller! Designers Ed Spurr and Amy Hall Browne of ILEX Studio drew their inspiration from Spurr’s stint at Matthew Marks Gallery in New York. The artworks opened the eyes of the designers to observe the form of leaves and to contemplate nature in a new way. Hand wash only. The Acorn Vase allows you to enjoy this process simply: just fill it with water and place an acorn or other plant (not included) in the small chamber at the top, and watch it grow, day by day.', 'https://store.moma.org/cdn/shop/files/b85d62c0-4038-4073-bcc0-4aef64e5491f_720x.jpg?v=1727811174', 35.00),
(6, 'Frida Kahlo Jigsaw Puzzle - 884 Pieces', 'This 884-piece Frida Kahlo Jigsaw Puzzle features a reproduction of Kahlo’s artwork Fulang-Chang and I (1937). This difficult puzzle is shaped around the unique frame. Fulang-Chang and I depicts Kahlo with one of her pet monkeys, interpreted by many as surrogates for the children she and Diego Rivera were unable to conceive. This puzzle includes a unique easy-to-assemble nine-compartment sorting tray for organizing the puzzle pieces inside the box. Made from 95% recycled greyboard and printed with non-toxic ink. Assembled, the puzzle measures 25.2l x 19.8"w.', 'https://store.moma.org/cdn/shop/files/153777_f_4789aa2f-1ccd-4ad4-8229-083a236192e7_720x.jpg?v=1704280963', 28),
(7, 'Lydia Ortiz Kisss Print', 'Lydia Ortiz Makeout Mountain Series Kisss Print 16x9', 'https://images.squarespace-cdn.com/content/v1/53bdd8f4e4b0fbc96b8320f9/1464744550811-10LDJYZ08DTJZN1UQUH6/Kisss2.jpg?format=1000w', 70.00);


INSERT INTO "cartItems" ("cartId", "userId", "productId", "quantity", "addedAt")
VALUES
(3, 1, 1, 1, '2025-01-01 12:10:00'),
(4, 2, 2, 2, '2025-01-01 12:15:00');
