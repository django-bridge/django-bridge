"""
Called by CircleCI when the nightly build fails.

This reports an error to the #nightly-build-failures Slack channel.
"""
import os
import requests

if 'SLACK_WEBHOOK_URL' in os.environ:
    print("Reporting to #nightly-build-failures slack channel")
    response = requests.post(os.environ['SLACK_WEBHOOK_URL'], json={
        "text": "A Nightly build failed. See " + os.environ['CIRCLE_BUILD_URL'],
    })

    print("Slack responded with:", response)

else:
    print("Unable to report to #nightly-build-failures slack channel because SLACK_WEBHOOK_URL is not set")
