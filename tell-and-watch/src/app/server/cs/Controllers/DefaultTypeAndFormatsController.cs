 



using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.ModelBinding;
using System.Web.OData;
using System.Web.OData.Query;
using System.Web.OData.Routing;
using AA.Mvp.Mwf.Models;

namespace AA.Mvp.MwfControllers
{

    public class DefaultTypeAndFormatsController : ODataController
    {
        private MwfMvpContext db = new MwfMvpContext();


          // GET: defaultTypeAndFormats
        [EnableQuery]
        public IQueryable<DefaultTypeAndFormat> GetDefaultTypeAndFormats()
        {
            return db.DefaultTypeAndFormats;
        }


        // GET: defaultTypeAndFormats(5)
        [EnableQuery]
        public SingleResult<DefaultTypeAndFormat> GetDefaultTypeAndFormat([FromODataUri] int key)
        {
            return SingleResult.Create(db.DefaultTypeAndFormats.Where(defaultTypeAndFormat => defaultTypeAndFormat.Id == key));
        }


        // PUT: defaultTypeAndFormats(5)
        public async Task<IHttpActionResult> Put([FromODataUri] int key, Delta<DefaultTypeAndFormat> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            DefaultTypeAndFormat defaultTypeAndFormat = await db.DefaultTypeAndFormats.FindAsync(key);
            if (defaultTypeAndFormat == null)
            {
                return NotFound();
            }

            patch.Put(defaultTypeAndFormat);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DefaultTypeAndFormatExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(defaultTypeAndFormat);
        }


        // POST: defaultTypeAndFormats
        public async Task<IHttpActionResult> Post(DefaultTypeAndFormat defaultTypeAndFormat)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.DefaultTypeAndFormats.Add(defaultTypeAndFormat);
            await db.SaveChangesAsync();

            return Created(defaultTypeAndFormat);
        }


        // PATCH: defaultTypeAndFormats(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] int key, Delta<DefaultTypeAndFormat> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            DefaultTypeAndFormat defaultTypeAndFormat = await db.DefaultTypeAndFormats.FindAsync(key);
            if (defaultTypeAndFormat == null)
            {
                return NotFound();
            }

            patch.Patch(defaultTypeAndFormat);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DefaultTypeAndFormatExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(defaultTypeAndFormat);
        }


        // DELETE: defaultTypeAndFormats(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] int key)
        {
            DefaultTypeAndFormat defaultTypeAndFormat = await db.DefaultTypeAndFormats.FindAsync(key);
            if (defaultTypeAndFormat == null)
            {
                return NotFound();
            }

            db.DefaultTypeAndFormats.Remove(defaultTypeAndFormat);
            await db.SaveChangesAsync();

            return StatusCode(HttpStatusCode.NoContent);
        }


  
    
  
    
  
    
  
    
  
    
  
    
  
    
  
    
  
    
  
    
  
    
  
    
  
    
  
    
  
    
  
    
  
    
  
    
  
    
  
    
  


  
      
  
      
  
      
  
      
  
      
  
      
  
      
  
      
  
      
  
      
  
      
  
      
  
      
  
      
  
      
  
      
  
      
  
      
  
      
  
      
  





        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool DefaultTypeAndFormatExists(int key)
        {
            return db.DefaultTypeAndFormats.Count(e => e.Id == key) > 0;
        }


    }
}
