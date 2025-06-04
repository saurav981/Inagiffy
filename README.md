# Inagiffy assignment

A site to find scholarships based on certain filters. This was a assignment for Inagiffy.

The special part of this project is, it has meaning based search. I implemented this using a free library "@xenova/transformers".

## Generate Embeddings

1. Import the "Scholarship data.json" file into MongoDB manually

2. Get into backend folder

   ```
   cd .\Backend
   ```

3. Generate and save embeddings in DB

   ```
   node .\utils\generateEmbeddings.js
   ```

4. Now you can search scholarships based on both meaning and filters.

   eg- if you search "girl", you will find "Women" in result. 

## Tech Stack

- @xenova/transformers



Hope you like it.