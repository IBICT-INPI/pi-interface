/* ============================================================
   UX Mobile Prototype — Lógica Auxiliar
   Ativa apenas para body.mobile-ux-prototype
============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  if (!document.body.classList.contains('mobile-ux-prototype')) return;

  // 1. Alternativa ao Drag-and-Drop (Ação por toque)
  const fieldsList = document.getElementById('fieldsList');
  if (fieldsList) {
    const injectButtons = () => {
      fieldsList.querySelectorAll('.pe-field-item').forEach(node => {
        if (!node.querySelector('.pe-mobile-add-btn')) {
          const btn = document.createElement('button');
          btn.className = 'pe-mobile-add-btn';
          btn.innerHTML = '<i class="fas fa-plus" aria-hidden="true"></i>';
          btn.setAttribute('aria-label', `Adicionar campo ${node.dataset.field}`);
          btn.type = 'button';
          
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            // Simula o duplo clique que já abre o menu na lógica original de pivot-ui.js
            node.dispatchEvent(new MouseEvent('dblclick'));
            
            // Melhorar o menu original injetando um título nativo no mobile (bottom sheet effect)
            setTimeout(() => {
              const menu = document.getElementById('pe-field-menu');
              if (menu && !menu.querySelector('.pe-menu-title')) {
                 const title = document.createElement('div');
                 title.className = 'pe-menu-title';
                 title.textContent = `Adicionar ${window.fieldDefs[node.dataset.field].label} a:`;
                 menu.insertBefore(title, menu.firstChild);
              }
            }, 20); // pequeno timeout para aguardar a renderização do menu
          });

          node.appendChild(btn);
        }
      });
    };

    // Executa imediatamente para garantir que os botões apareçam no primeiro carregamento
    injectButtons();

    // Observa mudanças para injetar em elementos criados posteriormente (ex: após busca/filtro)
    const observer = new MutationObserver(injectButtons);
    observer.observe(fieldsList, { childList: true, subtree: true });
  }

  // 2. Agrupar comandos da tabela no mobile
  const configBar = document.querySelector('.pe-config-bar');
  if (configBar) {
    const buttons = Array.from(configBar.querySelectorAll('.pe-btn'));
    if (buttons.length > 0) {
      const groupDiv = document.createElement('div');
      groupDiv.className = 'pe-actions-group';

      const toggleBtn = document.createElement('button');
      toggleBtn.className = 'pe-actions-group-toggle';
      toggleBtn.type = 'button';
      toggleBtn.innerHTML = '<span><i class="fas fa-sliders-h" aria-hidden="true"></i> Ações da Tabela</span> <i class="fas fa-chevron-down" aria-hidden="true" style="transition: transform 0.3s;"></i>';

      const contentDiv = document.createElement('div');
      contentDiv.className = 'pe-actions-group-content';

      toggleBtn.addEventListener('click', () => {
        const isExpanded = contentDiv.classList.contains('expanded');
        contentDiv.classList.toggle('expanded');
        toggleBtn.querySelector('.fa-chevron-down').style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(180deg)';
      });

      groupDiv.appendChild(toggleBtn);
      groupDiv.appendChild(contentDiv);

      buttons.forEach(btn => {
        contentDiv.appendChild(btn);
      });

      configBar.appendChild(groupDiv);
    }
  }

  // 3. Melhorar a visibilidade dos filtros ativos ("Limpar todos")
  const activeFiltersGrid = document.getElementById('activeFilters');
  const activeSlicersGrid = document.getElementById('activeSlicers');
  
  function addClearAllButton() {
    const panels = [document.getElementById('filtersPanel'), document.getElementById('slicersPanel')];
    
    // Tenta encontrar e remover os botões existentes para recriar conforme o estado
    document.querySelectorAll('.pe-clear-filters-btn').forEach(btn => btn.remove());

    panels.forEach(panel => {
      if (panel && panel.style.display !== 'none' && panel.querySelector('.pe-filter-box')) {
        const clearBtn = document.createElement('button');
        clearBtn.className = 'pe-btn pe-clear-filters-btn';
        clearBtn.type = 'button';
        clearBtn.innerHTML = '<i class="fas fa-trash-alt" aria-hidden="true"></i> Limpar Filtros';
        clearBtn.addEventListener('click', () => {
          if (window.resetPivot) window.resetPivot();
        });
        panel.appendChild(clearBtn);
      }
    });
  }

  if (activeFiltersGrid && activeSlicersGrid) {
    const filterObserver = new MutationObserver(addClearAllButton);
    filterObserver.observe(activeFiltersGrid, { childList: true });
    filterObserver.observe(activeSlicersGrid, { childList: true });
  }

  // 4. Reforçar o aviso de scroll horizontal
  const tableWrap = document.querySelector('.pe-table-wrap');
  const scrollHint = document.querySelector('.pe-scroll-hint');
  
  function checkScroll() {
    if (tableWrap && scrollHint) {
      if (tableWrap.scrollWidth > tableWrap.clientWidth) {
        scrollHint.classList.remove('hidden');
      } else {
        scrollHint.classList.add('hidden');
      }
    }
  }

  if (tableWrap && scrollHint) {
    // Checa overflow ao redimensionar ou após a tabela atualizar (escutando a tabela inteira)
    window.addEventListener('resize', checkScroll);
    const tableObserver = new MutationObserver(checkScroll);
    const table = document.querySelector('#pivotTable');
    if (table) {
      tableObserver.observe(table, { childList: true, subtree: true });
    }
    
    // Ocultar parcialmente o aviso animado se o usuário já aprendeu e rolou
    tableWrap.addEventListener('scroll', () => {
      if (tableWrap.scrollLeft > 20) {
        scrollHint.style.animation = 'none';
        scrollHint.style.opacity = '0.4';
      } else {
        scrollHint.style.animation = 'pulseHint 2.5s infinite';
        scrollHint.style.opacity = '1';
      }
    });
  }
});
