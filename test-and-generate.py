#!/usr/bin/env python3
import os
import sys

# Add any necessary paths
sys.path.insert(0, os.path.expanduser('~/.local/lib/python3.11/site-packages'))
sys.path.insert(0, '/usr/local/lib/python3.11/site-packages')
sys.path.insert(0, '/opt/homebrew/lib/python3.11/site-packages')

try:
    # Test import
    from docx import Document
    from docx.shared import Inches, Pt, RGBColor
    from docx.enum.text import WD_ALIGN_PARAGRAPH
    from docx.oxml.ns import qn
    from docx.oxml import OxmlElement

    print("SUCCESS: docx module imported")

    # Now execute the document creation
    exec(open('/Users/tanikafacey/Desktop/Cowork/create_docx_minimal.py').read())

except ModuleNotFoundError as e:
    print(f"Module not found: {e}")
    print("Attempting to install python-docx...")
    import subprocess
    try:
        subprocess.run(['/usr/bin/python3', '-m', 'pip', 'install', '--user', 'python-docx'],
                      capture_output=True, timeout=120)
        print("Installation attempted. Trying again...")
        # Retry
        from docx import Document
        exec(open('/Users/tanikafacey/Desktop/Cowork/create_docx_minimal.py').read())
    except Exception as install_err:
        print(f"Installation failed: {install_err}")
        sys.exit(1)
except Exception as e:
    print(f"ERROR: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
