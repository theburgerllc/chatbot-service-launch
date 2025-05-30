# Airtable Setup Guide

## 1. Create Airtable Base

1. Go to [airtable.com](https://airtable.com) and sign up/login
2. Click "Create a base" → "Start from scratch"
3. Name your base: "Chatbot Service Launch"
4. Rename the default table to: "Chatbot_Requests"

## 2. Set Up Table Fields

Delete the default fields and create these exact fields (case-sensitive):

| Field Name | Field Type | Notes |
|------------|------------|-------|
| Business Name | Single line text | Primary field |
| Website URL | URL | |
| Email | Email | |
| Phone Number | Phone number | |
| Business Hours | Single line text | |
| FAQ 1 | Long text | |
| FAQ 2 | Long text | |
| FAQ 3 | Long text | |
| Brand Color | Single line text | |
| Status | Single select | Options: New, In Progress, Completed, Cancelled |
| Created | Date and time | |
| Submission ID | Single line text | |
| Estimated Delivery | Date and time | |

## 3. Get API Credentials

1. Go to [airtable.com/api](https://airtable.com/api)
2. Select your "Chatbot Service Launch" base
3. Copy your Base ID (starts with "app...")
4. Go to [airtable.com/create/tokens](https://airtable.com/create/tokens)
5. Create a new token with these scopes:
   - `data.records:read`
   - `data.records:write`
   - `schema.bases:read`
6. Add your base to the token
7. Copy the token (starts with "pat...")

## 4. Environment Variables

Add these to your `.env.local` file:

```env
AIRTABLE_API_KEY=pat_your_token_here
AIRTABLE_BASE_ID=app_your_base_id_here
AIRTABLE_TABLE_NAME=Chatbot_Requests
```

## 5. Test the Integration

After setting up, test by submitting the form on your website. Check your Airtable base to see if the record appears.
