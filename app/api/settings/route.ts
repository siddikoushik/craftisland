import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// Helper function to map SQLite settings record to the structured client interface
export function mapDbSettings(s: any) {
  return {
    heroImage: s.heroImage,
    heroTagline: s.heroTagline,
    heroTitle: s.heroTitle,
    heroDescription: s.heroDescription,
    heroPrimaryBtnText: s.heroPrimaryBtnText,
    heroSecondaryBtnText: s.heroSecondaryBtnText,
    
    prop1Title: s.prop1Title,
    prop1Desc: s.prop1Desc,
    prop1Icon: s.prop1Icon,
    
    prop2Title: s.prop2Title,
    prop2Desc: s.prop2Desc,
    prop2Icon: s.prop2Icon,
    
    prop3Title: s.prop3Title,
    prop3Desc: s.prop3Desc,
    prop3Icon: s.prop3Icon,
    
    prop4Title: s.prop4Title,
    prop4Desc: s.prop4Desc,
    prop4Icon: s.prop4Icon,
    
    craftImage: s.craftImage,
    craftTagline: s.craftTagline,
    craftTitle: s.craftTitle,
    craftDescription: s.craftDescription,
    craftBullets: s.craftBullets ? s.craftBullets.split('\n').filter(Boolean) : [],
    craftBtnText: s.craftBtnText,
    
    scentHeading: s.scentHeading,
    scentSubtitle: s.scentSubtitle,
    scentFloralDesc: s.scentFloralDesc,
    scentWoodyDesc: s.scentWoodyDesc,
    scentGourmandDesc: s.scentGourmandDesc,
    scentFreshDesc: s.scentFreshDesc,
    
    testimonialHeading: s.testimonialHeading,
    testimonialTitle: s.testimonialTitle,
    testimonial1Body: s.testimonial1Body,
    testimonial1Author: s.testimonial1Author,
    testimonial1Location: s.testimonial1Location,
    testimonial2Body: s.testimonial2Body,
    testimonial2Author: s.testimonial2Author,
    testimonial2Location: s.testimonial2Location,
    testimonial3Body: s.testimonial3Body,
    testimonial3Author: s.testimonial3Author,
    testimonial3Location: s.testimonial3Location,
  }
}

// Retrieve active settings
export async function GET() {
  try {
    const settings = await prisma.homepageSettings.findUnique({
      where: { id: 'active' }
    })
    
    if (!settings) {
      return NextResponse.json({ error: 'Settings not found' }, { status: 404 })
    }
    
    return NextResponse.json({ settings: mapDbSettings(settings) })
  } catch (e) {
    console.error('Fetch settings error:', e)
    return NextResponse.json({ error: 'Failed to retrieve settings' }, { status: 500 })
  }
}

// Update settings (upserting to ensure robust single active row maintenance)
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const updated = await prisma.homepageSettings.upsert({
      where: { id: 'active' },
      update: {
        heroImage: body.heroImage,
        heroTagline: body.heroTagline,
        heroTitle: body.heroTitle,
        heroDescription: body.heroDescription,
        heroPrimaryBtnText: body.heroPrimaryBtnText,
        heroSecondaryBtnText: body.heroSecondaryBtnText,
        
        prop1Title: body.prop1Title,
        prop1Desc: body.prop1Desc,
        prop1Icon: body.prop1Icon,
        
        prop2Title: body.prop2Title,
        prop2Desc: body.prop2Desc,
        prop2Icon: body.prop2Icon,
        
        prop3Title: body.prop3Title,
        prop3Desc: body.prop3Desc,
        prop3Icon: body.prop3Icon,
        
        prop4Title: body.prop4Title,
        prop4Desc: body.prop4Desc,
        prop4Icon: body.prop4Icon,
        
        craftImage: body.craftImage,
        craftTagline: body.craftTagline,
        craftTitle: body.craftTitle,
        craftDescription: body.craftDescription,
        craftBullets: Array.isArray(body.craftBullets) ? body.craftBullets.join('\n') : body.craftBullets,
        craftBtnText: body.craftBtnText,
        
        scentHeading: body.scentHeading,
        scentSubtitle: body.scentSubtitle,
        scentFloralDesc: body.scentFloralDesc,
        scentWoodyDesc: body.scentWoodyDesc,
        scentGourmandDesc: body.scentGourmandDesc,
        scentFreshDesc: body.scentFreshDesc,
        
        testimonialHeading: body.testimonialHeading,
        testimonialTitle: body.testimonialTitle,
        testimonial1Body: body.testimonial1Body,
        testimonial1Author: body.testimonial1Author,
        testimonial1Location: body.testimonial1Location,
        testimonial2Body: body.testimonial2Body,
        testimonial2Author: body.testimonial2Author,
        testimonial2Location: body.testimonial2Location,
        testimonial3Body: body.testimonial3Body,
        testimonial3Author: body.testimonial3Author,
        testimonial3Location: body.testimonial3Location,
      },
      create: {
        id: 'active',
        heroImage: body.heroImage || '',
        heroTagline: body.heroTagline || '',
        heroTitle: body.heroTitle || '',
        heroDescription: body.heroDescription || '',
        heroPrimaryBtnText: body.heroPrimaryBtnText || '',
        heroSecondaryBtnText: body.heroSecondaryBtnText || '',
        
        prop1Title: body.prop1Title || '',
        prop1Desc: body.prop1Desc || '',
        prop1Icon: body.prop1Icon || '',
        
        prop2Title: body.prop2Title || '',
        prop2Desc: body.prop2Desc || '',
        prop2Icon: body.prop2Icon || '',
        
        prop3Title: body.prop3Title || '',
        prop3Desc: body.prop3Desc || '',
        prop3Icon: body.prop3Icon || '',
        
        prop4Title: body.prop4Title || '',
        prop4Desc: body.prop4Desc || '',
        prop4Icon: body.prop4Icon || '',
        
        craftImage: body.craftImage || '',
        craftTagline: body.craftTagline || '',
        craftTitle: body.craftTitle || '',
        craftDescription: body.craftDescription || '',
        craftBullets: Array.isArray(body.craftBullets) ? body.craftBullets.join('\n') : body.craftBullets || '',
        craftBtnText: body.craftBtnText || '',
        
        scentHeading: body.scentHeading || '',
        scentSubtitle: body.scentSubtitle || '',
        scentFloralDesc: body.scentFloralDesc || '',
        scentWoodyDesc: body.scentWoodyDesc || '',
        scentGourmandDesc: body.scentGourmandDesc || '',
        scentFreshDesc: body.scentFreshDesc || '',
        
        testimonialHeading: body.testimonialHeading || '',
        testimonialTitle: body.testimonialTitle || '',
        testimonial1Body: body.testimonial1Body || '',
        testimonial1Author: body.testimonial1Author || '',
        testimonial1Location: body.testimonial1Location || '',
        testimonial2Body: body.testimonial2Body || '',
        testimonial2Author: body.testimonial2Author || '',
        testimonial2Location: body.testimonial2Location || '',
        testimonial3Body: body.testimonial3Body || '',
        testimonial3Author: body.testimonial3Author || '',
        testimonial3Location: body.testimonial3Location || '',
      }
    })

    return NextResponse.json({ settings: mapDbSettings(updated) })
  } catch (e) {
    console.error('Update settings error:', e)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
