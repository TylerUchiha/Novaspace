import sys

with open('components/GlobalConfigPage.tsx', 'r') as f:
    content = f.read()

find_str = """                </div>
              </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalConfigPage;"""

replace_str = """                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default GlobalConfigPage;"""

content = content.replace(find_str, replace_str)
with open('components/GlobalConfigPage.tsx', 'w') as f:
    f.write(content)

