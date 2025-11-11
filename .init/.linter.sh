#!/bin/bash
cd /home/kavia/workspace/code-generation/customer-support-portal-185738-185748/customer_service_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

