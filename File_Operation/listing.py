import os

def list_files_and_sizes(directory_path):
    """
    Lists all files and their sizes in a given directory.
    """
    if not os.path.isdir(directory_path):
        print(f"Error: Directory '{directory_path}' not found.")
        return

    print(f"Files in '{directory_path}':")
    for item in os.listdir(directory_path):
        item_path = os.path.join(directory_path, item)
        if os.path.isfile(item_path):
            size_bytes = os.path.getsize(item_path)
            print(f"- {item} (Size: {size_bytes} bytes)")

# --- How to use this script ---
if __name__ == "__main__":
    # You can change this to a directory on your system for testing
    # For example: '/home/youruser/Documents' or 'C:\\Users\\youruser\\Documents'
    target_directory = input("Enter the directory path to list files: ")
    list_files_and_sizes(target_directory)
